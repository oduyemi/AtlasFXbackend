import { Controller, Get, Param } from "@nestjs/common"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(":id")
    getUser(@Param("id") id: number) {
    return this.usersService.getUserProfile(id)
    };

}