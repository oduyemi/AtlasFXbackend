import { Injectable } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class FxService {
    private cache = new Map<string, number>()

    async getRate(from: string, to: string) {
        const key = `${from}_${to}`
        if (this.cache.has(key)) {
        return this.cache.get(key)
        }
        
        const response = await axios.get(
        `https://open.er-api.com/v6/latest/${from}`
        )
        const rate = response.data.rates[to]
        this.cache.set(key, rate)
        setTimeout(() => {
        this.cache.delete(key)
        }, 60000)
        
        return rate
    }
}