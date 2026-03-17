import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class FxService {
  private API_KEY = process.env.FX_API_KEY!;
  private BASE_URL = "https://v6.exchangerate-api.com/v6";

  async getRate(from: string, to: string): Promise<number> {
    const url = `${this.BASE_URL}/${this.API_KEY}/pair/${from}/${to}`;

    const response = await axios.get(url);

    return response.data.conversion_rate;
  }
}