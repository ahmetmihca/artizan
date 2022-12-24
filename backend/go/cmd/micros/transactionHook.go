package main

import (
	"log"

	"github.com/nanmu42/etherscan-api"
)

// After detecting a transaction/transactions calls the callback function
func NormalTransactionHook(contract string, callback func(etherscan.NormalTx) (bool, error)) {
	// TODO: add error handling for termination, maybe pronblem occured after some point ...

	txs, err := etherscanClient.NormalTxByAddress(contract, nil, nil, 0, 0, true)
	if err != nil {
		log.Println("Error while getting transactions", err)
	} else {
		for _, tx := range txs {
			if tx.IsError == 0 {
				terminate, _ := callback(tx)
				if terminate {
					break
				}
			}
		}
	}
}

func erc721TransactionHook(contract string, callback func(etherscan.ERC721Transfer) (bool, error)) {
	// TODO: add error handling for termination, maybe pronblem occured after some point ...

	txs, err := etherscanClient.ERC721Transfers(&contract, nil, nil, nil, 0, 0, true)
	if err != nil {
		log.Println("Error while getting transactions", err)
	} else {
		for _, tx := range txs {
			terminate, _ := callback(tx)
			if terminate {
				break
			}
		}
	}
}
