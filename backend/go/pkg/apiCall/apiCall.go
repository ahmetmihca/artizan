package apiCall

import (
	"io/ioutil"
	"log"
	"net/http"
)

type Params struct {
	Headers    map[string][]string
	BodyFields map[string]string
}

func GET(url string, params Params) ([]byte, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println(err)
		return []byte{}, err
	}

	req.Header = params.Headers

	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return []byte{}, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return []byte{}, err
	}

	return body, nil
}
