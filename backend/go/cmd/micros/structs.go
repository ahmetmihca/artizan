package main

import (
	"time"
)

type Sale struct {
	TxHash string    `bson:"txHash"`
	Value  string    `bson:"value"`
	Time   time.Time `bson:"time"`
}

type ERC721Tx struct {
	TxHash   string    `bson:"txHash"`
	TokenID  string    `bson:"tokenID"`
	Contract string    `bson:"contract"`
	Time     time.Time `bson:"time"`
}
