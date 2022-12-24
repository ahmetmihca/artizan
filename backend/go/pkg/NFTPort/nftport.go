package nftport

import (
	"encoding/json"
	"fmt"
	"log"
	"nftProject/pkg/apiCall"
)

type NFTInfoDetailed struct {
	Response string `json:"response"`
	Nft      struct {
		Chain           string `json:"chain"`
		ContractAddress string `json:"contract_address"`
		TokenID         string `json:"token_id"`
		MetadataURL     string `json:"metadata_url"`
		Metadata        struct {
			Attributes []struct {
				TraitType string      `json:"trait_type"`
				Value     interface{} `json:"value"`
			} `json:"attributes"`
			Description string `json:"description"`
			Image       string `json:"image"`
			Name        string `json:"name"`
		} `json:"metadata"`
		FileInformation interface{} `json:"file_information"`
		FileURL         string      `json:"file_url"`
		CachedFileURL   string      `json:"cached_file_url"`
		MintDate        string      `json:"mint_date"`
		UpdatedDate     string      `json:"updated_date"`
	} `json:"nft"`
	Owner    string `json:"owner"`
	Contract struct {
		Name   string `json:"name"`
		Symbol string `json:"symbol"`
		Type   string `json:"type"`
	} `json:"contract"`
}

type NFTport struct {
	Token string
}

func NewInstance(token string) NFTport {
	var instance NFTport
	instance.Token = token

	return instance
}

func (instance NFTport) GetNFTInformation(contractID string, tokenID string) (NFTInfoDetailed, error) {
	var info NFTInfoDetailed

	url := fmt.Sprintf("https://api.nftport.xyz/v0/nfts/%s/%s?chain=ethereum", contractID, tokenID)

	resp, err := apiCall.GET(
		url,
		apiCall.Params{
			Headers: map[string][]string{
				"Content-Type":  {"application/json"},
				"Authorization": {instance.Token},
			},
		},
	)
	if err != nil {
		log.Println(err)
		return info, err
	}

	err = json.Unmarshal(resp, &info)
	if err != nil {
		log.Println(err)
		return info, err
	}

	return info, nil
}
