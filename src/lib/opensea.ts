import { CONTRACT_ADDRESS, getPrice } from './eth'

export const OPEANSEA_API = process.env.REACT_APP_OPENSEA_API
export const OPEANSEA_URL = process.env.REACT_APP_OPENSEA_URL
export const PAGE_SIZE = 48

export type Asset = {
  id: string
  image: string
  preview: string
  owner: string
  price: number | null
}

export async function loadPage(page: number) {
  const limit = PAGE_SIZE
  const offset = page * PAGE_SIZE
  try {
    const [ethPrice, resp] = await Promise.all([
      await getPrice(),
      await fetch(
        `${OPEANSEA_API}/api/v1/assets?asset_contract_address=${CONTRACT_ADDRESS}&limit=${limit}&offset=${offset}`
      )
    ])
    const { assets } = await resp.json()
    return assets.map((asset: any) => {
      let price = null
      if (asset.sell_orders && asset.sell_orders.length > 0) {
        const order = asset.sell_orders[0]
        price =
          (order.current_price /
            Math.pow(10, order.payment_token_contract.decimals)) *
          order.payment_token_contract.eth_price *
          ethPrice
      }
      return {
        id: asset.token_id,
        image: asset.image_url,
        preview: asset.image_preview_url,
        owner: asset.owner.address,
        price
      }
    }) as Asset[]
  } catch (e) {
    return []
  }
}
