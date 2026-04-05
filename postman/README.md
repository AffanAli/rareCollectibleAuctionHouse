# Postman / Newman

## Import into Postman

1. Open Postman → **Import**.
2. Choose `rare-collectible-auction-house.postman_collection.json`.
3. Optional: import `local.postman_environment.json`, then select **Rare Collectible – Local** in the environment dropdown.

Collection variables `baseUrl` and `auctionId` are also defined on the collection if you skip the environment.

## Postman CLI (Newman)

With the API running (`npm run start:dev`):

```bash
cd rareCollectibleAuctionHouse
npx newman run postman/rare-collectible-auction-house.postman_collection.json -e postman/local.postman_environment.json
```

Override URL without editing files:

```bash
npx newman run postman/rare-collectible-auction-house.postman_collection.json \
  --env-var "baseUrl=http://127.0.0.1:3000"
```

Optional: fail build on non-2xx responses:

```bash
npx newman run postman/rare-collectible-auction-house.postman_collection.json \
  -e postman/local.postman_environment.json \
  --bail failure
```
