package types

type NFT struct {
	Contract  string `bson:"contract"`
	TokenID   int    `bson:"tokenID"`
	Metadata  Metadata
	Favorited int `bson:"favorited"`
}

type Metadata struct {
	ImgURL      string        `bson:"imgURL"`
	Name        string        `bson:"name"`
	Description string        `bson:"description"`
	Attributes  []interface{} `bson:"attributes"`
}
