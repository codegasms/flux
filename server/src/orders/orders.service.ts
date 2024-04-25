import { BadRequestException, Injectable } from '@nestjs/common';

import Razorpay from 'razorpay';
import { rzpConfig } from './config';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderCreatedDto } from './dto/order-created.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
@Injectable()
export class OrdersService {
  rzpClient: Razorpay;

  constructor() {
    this.rzpClient = new Razorpay({
      key_id: rzpConfig.keyId,
      key_secret: rzpConfig.keySecret,
    });
  }
  async create(createOrderDto: CreateOrderDto): Promise<OrderCreatedDto> {
    try {
      const response = await this.rzpClient.orders.create({
        ...createOrderDto,
      });
      // TODO: save entry in db for future tracking
      return {
        key: rzpConfig.keyId,
        order: response,
        verifyUrl: 'orders/verify',
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async verify(verifyPaymentDto: VerifyPaymentDto): Promise<boolean> {
    console.log(verifyPaymentDto);
    // TODO: fetch order id from db to check if it exists
    validatePaymentVerification(
      {
        order_id: verifyPaymentDto.razorpay_order_id,
        payment_id: verifyPaymentDto.razorpay_payment_id,
      },
      verifyPaymentDto.razorpay_signature,
      rzpConfig.keySecret,
    );
    // TODO: mark payment success in db
    return true;
  }
}
