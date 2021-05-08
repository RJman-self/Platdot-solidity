package main

import (
	"fmt"

	gsrpc "github.com/centrifuge/go-substrate-rpc-client/v3"
	"github.com/centrifuge/go-substrate-rpc-client/v3/signature"
	"github.com/centrifuge/go-substrate-rpc-client/v3/types"
)

func main() {
	fmt.Println("sad")	
	sendSimpleTx()
}

func sendSimpleTx() bool {
	var pubkey = types.MustHexDecodeString("0x923eeef27b93315c97e63e0c1284b7433ffbc413a58da0626a63955a48586075")
	var seed = "0x3c0c4fc26010d0512cd36a0f467375b3dbe2f207bbfda0c551b5e41ee495e909"
	var addr = "5FNTYUQwxjrVE5zRRH1hKh6fZ72AosHB7ThVnNnq9Bv9BFjm"
	//var phrase = "outer spike flash urge bus text aim public drink pumpkin pretty loan"

	sender := signature.KeyringPair{
		URI:       seed,
		Address:   addr,
		PublicKey: pubkey,
	}

	api, err := gsrpc.NewSubstrateAPI("wss://supercube.pro/ws")
	if err != nil {
		panic(err)
	}

	meta, err := api.RPC.State.GetMetadataLatest()
	if err != nil {
		panic(err)
	}


	//serialize signature data
	//types.SetSerDeOptions(types.SerDeOptions{NoPalletIndices: true})

	//BEGIN: Create a call of transfer
	method := "Balances.transfer"
	recipient, _ := types.NewMultiAddressFromHexAccountID("0x0a19674301c56a1721feb98dbe93cfab911a8c1bed127f598ef93b374bcc6e71")
	amount := types.NewUCompactFromUInt(100000000)

	//assetId := types.NewUCompactFromUInt(1)

	c, err := types.NewCall(
		meta,
		method,
		recipient,
		amount,
	)
	if err != nil {
		panic(err)
	}

	ext := types.NewExtrinsic(c)

	genesisHash, err := api.RPC.Chain.GetBlockHash(0)
	if err != nil {
		panic(err)
	}
	rv, err := api.RPC.State.GetRuntimeVersionLatest()
	if err != nil {
		panic(err)
	}

	key, err := types.CreateStorageKey(meta, "System", "Account", sender.PublicKey, nil)
	if err != nil {
		panic(err)
	}

	var accountInfo types.AccountInfo
	ok, err := api.RPC.State.GetStorageLatest(key, &accountInfo)
	if err != nil || !ok {
		panic(err)
	}

	nonce := uint32(accountInfo.Nonce)

	o := types.SignatureOptions{
		BlockHash:          genesisHash,
		Era:                types.ExtrinsicEra{IsMortalEra: false},
		GenesisHash:        genesisHash,
		Nonce:              types.NewUCompactFromUInt(uint64(nonce)),
		SpecVersion:        rv.SpecVersion,
		Tip:                types.NewUCompactFromUInt(0),
		TransactionVersion: rv.TransactionVersion,
	}

	err = ext.Sign(sender, o)
	if err != nil {
		panic(err)
	}

	sub, err := api.RPC.Author.SubmitAndWatchExtrinsic(ext)
	if err != nil {
		panic(err)
	}
	defer sub.Unsubscribe()

	for {
		status := <-sub.Chan()
		fmt.Printf("Transaction status: %#v\n", status)
		if status.IsFinalized {
			//w.conn.api.
			fmt.Printf("Completed at block hash: %#x\n", status.AsFinalized)
		}
	}
}