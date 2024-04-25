import { ApiProperty } from '@nestjs/swagger';

export class RzpOrderSuccess {
  id: string;
  entity: string;
  amount: string | number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt?: string;
  offer_id?: string | null;
  status: 'created' | 'attempted' | 'paid';
  attempts: number;
  notes?: Record<string | number, string | number>;
  created_at: number;
}

class PrefillCustomerDetails {
  name: string;
  email: string;
  contact: string;
}

export class OrderCreatedDto {
  @ApiProperty({ description: 'Razorpay API Key' })
  key: string;

  @ApiProperty({
    description: 'Order object returned by Razorpay on successful creation',
  })
  order: RzpOrderSuccess;

  @ApiProperty({
    default: 'orders/verify',
    description:
      'Set this as the callback URL for Razorpay Client. You can optionally set two query parameters success_redirect and failure_redirect. These two should be the frontend URLs that the backend server will redirect to.<br><br>The final URL you should set is <br><code>https://backend.com/{verifyUrl}?frontend_base=https://yourfrontend.com&success_redirect=/successHandler&failure_redirect=/failureHandler</code>',
  })
  verifyUrl: string;

  @ApiProperty({
    description:
      'Details about logged in user, which can be prefilled in Payment Checkout forms, for a smoother experience',
  })
  prefill?: PrefillCustomerDetails | null;
}
