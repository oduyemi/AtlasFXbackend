import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags("users")
@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(":id")
    @ApiOperation({ summary: 'Get user details' })
    @ApiResponse({ status: 201, description: 'User details' })
    getUser(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.getUserProfile(id)
    };

}