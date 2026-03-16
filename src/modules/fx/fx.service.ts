import { Injectable } from "@nestjs/common";
import axios from "axios";


@Injectable()
export class FxService {
  async getRate(from: string, to: string) {
    const response = await axios.get(
      `https://open.er-api.com/v6/latest/${from}`
    )

    return response.data.rates[to]
  }
}