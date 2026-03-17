import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ParseIntPipe } from "@nestjs/common";


@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(":id")
    getUser(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.getUserProfile(id)
    };

}