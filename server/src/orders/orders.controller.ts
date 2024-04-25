import { Controller, Req, Post, Body, Query, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';

import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/auth/public.decorator';

import { OrderFailedDto } from './dto/order-failed.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderCreatedDto } from './dto/order-created.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBadRequestResponse({
    type: OrderFailedDto,
  })
  @Post('/create')
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderCreatedDto> {
    console.log('hit');
    return await this.ordersService.create(createOrderDto);
  }

  @Public()
  @Post('/verify')
  @ApiQuery({
    name: 'frontendBase',
    description: 'The base url where your frontend is hosted',
  })
  @ApiQuery({
    name: 'successRedirect',
    description: 'The path in your frontend that shows payment success',
  })
  @ApiQuery({
    name: 'failureRedirect',
    description: 'The path in your frontend that shows payment success',
  })
  @ApiOperation({
    summary: 'Verify Payment and redirect to frontend success or failure page',
    description:
      'NOTE: You will never be calling this endpoint on your own, Razorpay client sdk would! You would compose the callback url you provide to Razorpay, where you set appropriate query parameters',
  })
  verify(
    @Query('frontendBase') frontendBase: string,
    @Query('successRedirect') successRedirect: string,
    @Query('failureRedirect') failureRedirect: string,
    @Body() verifyPaymentDto: VerifyPaymentDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.ordersService.verify(verifyPaymentDto))
      res.redirect(frontendBase + successRedirect);
    else res.redirect(frontendBase + failureRedirect);
  }
}
