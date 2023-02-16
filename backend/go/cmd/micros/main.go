package main

import (
	"context"
	"log"
	enum "nftProject/enums"
	"time"

	"github.com/nanmu42/etherscan-api"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const nftContractAddress = "0x3D8893443F72D437eBbBCe46e4B37dFB4CAe01fa"
const marketContractAddress = "0xaF47F2896Cf59F7620eB700B89DBb495C6aa944a"

type TX struct {
	input string
}

var db *mongo.Database

const mongoURI = "mongodb+srv://admin:admin@cluster0.trsxehj.mongodb.net/?retryWrites=true&w=majority" //"mongodb+srv://artizan:9s2NRJi2OpXZlJUH@cluster0.feljg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

var etherscanClient *etherscan.Client

func main() {
	etherscanClient = etherscan.New(etherscan.Ropsten, "ZECN92AM5YJE322URVWYQ1IGRGXC4GSK3U")

	// Connect DB
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoURI))
	defer client.Disconnect(context.TODO())

	if err != nil {
		log.Fatalln("Could not connect to mongo: ", err)
	}

	db = client.Database("myFirstDatabase")

	log.Println("DB connection established: ", db.Name())

	go loopWithInterval(time.Second*60, func() {
		log.Println("Transaction hook called")
		NormalTransactionHook(marketContractAddress, onTransaction)
	})

	go loopWithInterval(time.Second*60, func() {
		log.Println("ERC721 hook called")
		erc721TransactionHook(nftContractAddress, onERC721Transfer)
	})

	for {
		time.Sleep(10000 * time.Second)
	}
}

func loopWithInterval(interval time.Duration, callback func()) {
	for {
		callback()
		time.Sleep(interval)
	}
}

func GetTxType(input string) int {
	input = input[:8]

	if input == `0xc23b13` {
		return enum.Sale
	}

	return enum.Unknown
}

func onTransaction(tx etherscan.NormalTx) (bool, error) {
	terminate := false
	if GetTxType(tx.Input) == enum.Sale {
		terminate = terminate || HandleSale(tx)
	}
	return terminate, nil
}

func onERC721Transfer(tx etherscan.ERC721Transfer) (bool, error) {
	terminate := false
	var err error

	col := db.Collection("ERC721_Transfers")
	result, err := col.Find(context.TODO(), bson.M{"txHash": tx.Hash})

	if err != nil {
		log.Println("Error:", err)
		return false, err
	}

	if result.Next(context.TODO()) == false { //is not in database
		transfer := ERC721Tx{
			TxHash:   tx.Hash,
			TokenID:  tx.TokenID.Int().String(),
			Contract: tx.ContractAddress,
			Time:     tx.TimeStamp.Time(),
		}
		col.InsertOne(context.TODO(), transfer)
	} else {
		terminate = true
	}

	return terminate, err
}

func HandleSale(tx etherscan.NormalTx) bool {
	// Connect Collection
	col := db.Collection("Sales")

	result, err := col.Find(context.TODO(), bson.M{"txHash": tx.Hash})

	if err != nil {
		log.Println("Error:", err)
		return false
	}

	if result.Next(context.TODO()) == false { //is not in database
		sale := Sale{
			tx.Hash,
			tx.Value.Int().String(),
			time.Time(tx.TimeStamp),
		}
		col.InsertOne(context.TODO(), sale)
	} else {
		return true
	}

	return false
}
