import sequelize from './config/database.js';
import models from './models/relation.js';

const {
  ServiceInfo,
  ClientInfo,
  ChargingInterface,
  ChIntfApiInfo,
  PaymentPlan,
  PricePoint
} = models;

async function seedDatabase() {
  try {
    
    // console.log('🔄 Clearing old data from all tables...');
    // await sequelize.query(`
    //   TRUNCATE TABLE
    //     tbl_service_info,
    //     tbl_client_info,
    //     tbl_charging_interface,
    //     tbl_chintf_api_info,
    //     tbl_payment_plan,
    //     tbl_price_points
    //   RESTART IDENTITY CASCADE;
    // `);
    // console.log('All tables cleared.');

    // 2. SEED LEVEL 0: Tables with no dependencies
    // console.log('Seeding Level 0 tables...');
    
    const services = await ServiceInfo.bulkCreate([
      { service_name: 'JiffyPay Wallet', status: 'active' },
      { service_name: 'JiffyPay Cards', status: 'active' },
      { service_name: 'JiffyPay UPI', status: 'test' },
      { service_name: 'JiffyPay Payouts', status: 'active' },
      { service_name: 'JiffyPay Lending', status: 'inactive' },
      { service_name: 'JiffyPay KYC', status: 'test' }
    ]);

    const clients = await ClientInfo.bulkCreate([
      { status: 'active' }, 
      { status: 'test' },   
      { status: 'active' }, 
      { status: 'inactive' },
      { status: 'active' },
      { status: 'test' }    
    ]);

    const interfaces = await ChargingInterface.bulkCreate([
      { chintf_name: 'Stripe Gateway', chintf_handler: 'StripeHandler', status: 'active', callback_url: '/callback/stripe' },
      { chintf_name: 'PayPal Gateway', chintf_handler: 'PayPalHandler', status: 'test', callback_url: '/callback/paypal' },
      { chintf_name: 'Internal Points', chintf_handler: 'InternalHandler', status: 'active', callback_url: '/callback/internal' },
      { chintf_name: 'Razorpay Gateway', chintf_handler: 'RazorpayHandler', status: 'active', callback_url: '/callback/razorpay' },
      { chintf_name: 'Bank Transfer (NEFT)', chintf_handler: 'BankHandler', status: 'active', callback_url: '/callback/bank' },
      { chintf_name: 'Test Fallback', chintf_handler: 'FallbackHandler', status: 'inactive', callback_url: '/callback/fallback' }
    ]);
    console.log(`Created ${services.length} services, ${clients.length} clients, and ${interfaces.length} interfaces.`);

    // 3. SEED LEVEL 1: Tables with dependencies on Level 0
    console.log('Seeding Level 1 tables...');
    
    // Get IDs to link
    const [service1, service2, service3, service4, service5, service6] = services.map(s => s.service_id);
    const [client1, client2, client3, client4, client5, client6] = clients.map(c => c.client_id);
    const [iface1, iface2, iface3, iface4, iface5, iface6] = interfaces.map(i => i.chintf_id); 

    const apiInfos = await ChIntfApiInfo.bulkCreate([
      { api_name: 'Stripe Charge', category: 'Payment', chintf_id: iface1 },
      { api_name: 'Stripe Refund', category: 'Refund', chintf_id: iface1 },
      { api_name: 'PayPal Create Order', category: 'Payment', chintf_id: iface2 },
      { api_name: 'Razorpay Create Order', category: 'Payment', chintf_id: iface4 },
      { api_name: 'Razorpay Verify Signature', category: 'Utility', chintf_id: iface4 },
      { api_name: 'Bank Verify Account', category: 'Utility', chintf_id: iface5 },
      { api_name: 'Internal Debit', category: 'Payment', chintf_id: iface3 },
    ]);


    const today = new Date();
    const distantFuture = new Date('2099-12-31');
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    const threeYears = new Date();
    threeYears.setFullYear(threeYears.getFullYear() + 3);


    const plans = await PaymentPlan.bulkCreate([
      {
        plan_name: 'Wallet Monthly',
        payment_category: 'Subscription',
        service_id: service1, client_id: client1, status: 'active',
        master_price: 100.00, master_validity: 30,
        validity_start: today, // Starts today
        validity_end: distantFuture // Open-ended subscription
      },
      
      {
        plan_name: 'One-Time Card Fee',
        payment_category: 'one time',
        service_id: service2, client_id: client1, status: 'active',
        master_price: 499.00, master_validity: 1095, // 3 years
        validity_start: lastMonth, // Plan was available last month
        validity_end: threeYears // Ends 3 years from now
      },

      {
        plan_name: 'Test Wallet Top-up',
        payment_category: 'Addon-topup',
        service_id: service1, client_id: client2, status: 'test',
        master_price: 50.00, master_validity: 365, // 1 year
        validity_start: today,
        validity_end: nextYear // Valid for exactly one year
      },

      {
        plan_name: 'Payouts API Plan',
        payment_category: 'Subscription',
        service_id: service4, client_id: client3, status: 'active',
        master_price: 2500.00, master_validity: 30,
        validity_start: today,
        validity_end: distantFuture // Open-ended subscription
      },

      {
        plan_name: 'Test KYC Service',
        payment_category: 'one time',
        service_id: service6, client_id: client2, status: 'test',
        master_price: 5.00, master_validity: 9999, // "Forever"
        validity_start: lastMonth,
        validity_end: distantFuture // Effectively forever
      },

      {
        plan_name: 'UPI Onetime (Client 5)',
        payment_category: 'one time',
        service_id: service3, client_id: client5, status: 'active',
        master_price: 0.00, master_validity: 9999, // "Forever"
        validity_start: today,
        validity_end: distantFuture // Effectively forever
      }
    ]);
    console.log(`Created ${apiInfos.length} API infos and ${plans.length} payment plans.`);
    
    // 4. SEED LEVEL 2: Tables with dependencies on Level 1
    console.log(' Seeding Level 2 tables (with fallback logic)...');

    // Get plan IDs to link
    const [plan1, plan2, plan3, plan4, plan5, plan6] = plans.map(p => p.pplan_id);

    const pricePoints = await PricePoint.bulkCreate([
      {
        price: 100.00, validity_period: 30,
        chintf_id: iface1, pplan_id: plan1, // Main price: Plan 1 (Wallet) -> Stripe
        has_fallback: true, is_fallback: false, 
        charging_params: 'plan=monthly_wallet_100&currency=inr'
      },
      {
        price: 100.00, validity_period: 30,
        chintf_id: iface4, pplan_id: plan1, // Fallback price: Plan 1 (Wallet) -> Razorpay
        has_fallback: false, is_fallback: true, 
        charging_params: 'plan=monthly_wallet_100&currency=inr&fallback=true'
      },
      
      {
        price: 499.00, validity_period: 1095,
        chintf_id: iface1, pplan_id: plan2, // Plan 2 (Card) -> Stripe
        has_fallback: false, is_fallback: false,
        charging_params: 'item=physical_card_fee&currency=inr'
      },
      
      {
        price: 50.00, validity_period: 365,
        chintf_id: iface2, pplan_id: plan3, // Plan 3 (Test Top-up) -> PayPal
        has_fallback: false, is_fallback: false,
        charging_params: 'sku=test_topup_50&currency=usd'
      },

      {
        price: 2500.00, validity_period: 30,
        chintf_id: iface4, pplan_id: plan4, // Main price: Plan 4 (Payouts) -> Razorpay
        has_fallback: true, is_fallback: false, 
        charging_params: 'plan_id=payout_monthly_2500&currency=inr'
      },
      {
        price: 2500.00, validity_period: 30,
        chintf_id: iface1, pplan_id: plan4, // Fallback price: Plan 4 (Payouts) -> Stripe
        has_fallback: false, is_fallback: true, 
        charging_params: 'plan_id=payout_monthly_2500&currency=inr&fallback=true'
      },
      
      {
        price: 5.00, validity_period: 9999,
        chintf_id: iface3, pplan_id: plan5, // Plan 5 (KYC) -> Internal Points
        has_fallback: false, is_fallback: false,
        charging_params: 'service_code=KYC_CHECK&cost=5'
      },
      
      {
        price: 10.00, validity_period: 1, // A special one-day price
        chintf_id: iface4, pplan_id: plan6, // Plan 6 (UPI) -> Razorpay
        has_fallback: false, is_fallback: false,
        charging_params: 'item=upi_onetime_10&currency=inr'
      }
    ]);
    console.log(`Created ${pricePoints.length} price points.`);

    console.log('Database seeded successfully with validity dates!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

seedDatabase();