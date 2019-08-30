import { useState } from 'react'
import { Asset, loadPage, PAGE_SIZE } from '../lib/opensea'
import { throttle } from '../lib/throttle'

const load = throttle(loadPage)

const toObject = (list: Asset[] = []) => {
  return list.reduce<Record<string, Asset>>((obj, asset) => {
    obj[asset.id] = asset
    return obj
  }, {})
}

export function useOpenSea() {
  const [hasMore, setHasMore] = useState(true)
  const [assets, setAssets] = useState<Asset[]>([])

  return {
    assets,
    hasMore,
    async loadPage(page: number) {
      const loadedAssets = await load(page - 1)
      setAssets(assets =>
        Object.values({
          ...toObject(assets),
          ...toObject(loadedAssets)
        }).sort((a, b) => (Number(a.id) > Number(b.id) ? -1 : 1))
      )
      setHasMore(loadedAssets.length === PAGE_SIZE)
    }
  }
}
