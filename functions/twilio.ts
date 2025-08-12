//@ts-nocheck
import { Twilio } from 'twilio';

// Types and Interfaces
interface PhoneCapabilities {
  voice: boolean;
  sms: boolean;
  mms: boolean;
}

interface AvailableNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  postalCode: string;
  capabilities: PhoneCapabilities;
}

interface PurchaseResult {
  success: boolean;
  phoneNumber: string;
  sid?: string;
  friendlyName?: string;
  accountSid?: string;
  authToken?: string;
  capabilities?: PhoneCapabilities;
  status?: string;
  dateCreated?: string;
  dateUpdated?: string;
  purchaseTimestamp?: string;
  error?: string;
}

interface AccountInfo {
  accountSid: string;
  authToken: string;
  friendlyName?: string;
  status?: string;
  type?: string;
  dateCreated?: string;
  dateUpdated?: string;
  error?: string;
}

class TwilioPurchaser {
  private client: Twilio;
  private accountSid: string;
  private authToken: string;

  constructor(accountSid: string, authToken: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.client = new Twilio(accountSid, authToken);
  }

  /**
   * Search for available phone numbers in the US
   */
  async searchAvailableNumbers(
    countryCode: string = "US",
    areaCode?: string,
    limit: number = 20
  ): Promise<AvailableNumber[]> {
    try {
      const searchParams: any = { limit: limit };

      if (areaCode) {
        searchParams.areaCode = areaCode;
      }

      const availableNumbers = await this.client.availablePhoneNumbers(countryCode)
        .local.list(searchParams);

      return availableNumbers.map(number => ({
        phoneNumber: number.phoneNumber,
        friendlyName: number.friendlyName || '',
        locality: number.locality || '',
        region: number.region || '',
        postalCode: number.postalCode || '',
        capabilities: {
          voice: number.capabilities?.voice || false,
          sms: number.capabilities?.sms || false,
          mms: number.capabilities?.mms || false
        }
      }));

    } catch (error) {
      console.error(`Error searching for available numbers: ${error}`);
      return [];
    }
  }

  /**
   * Purchase a single phone number
   */
 async purchasePhoneNumber(phoneNumber: string, friendlyName?: string): Promise<PurchaseResult> {
    try {
      const purchaseParams: any = {
        phoneNumber: phoneNumber
      };

      if (friendlyName) {
        purchaseParams.friendlyName = friendlyName;
      }

      const purchasedNumber = await this.client.incomingPhoneNumbers.create(purchaseParams);

      return {
        success: true,
        phoneNumber: purchasedNumber.phoneNumber,
        sid: purchasedNumber.sid,
        friendlyName: purchasedNumber.friendlyName || undefined,
        accountSid: this.accountSid,
        authToken: this.authToken,
        capabilities: {
          voice: purchasedNumber.capabilities?.voice || false,
          sms: purchasedNumber.capabilities?.sms || false,
          mms: purchasedNumber.capabilities?.mms || false
        },
        status: purchasedNumber.status,
        dateCreated: purchasedNumber.dateCreated?.toISOString(),
        dateUpdated: purchasedNumber.dateUpdated?.toISOString(),
        purchaseTimestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        phoneNumber: phoneNumber,
        error: String(error)
      };
    }
  }

  /**
   * Purchase multiple phone numbers
   */
  async purchaseMultipleNumbers(
    count: number,
    areaCode?: string,
    friendlyNamePrefix: string = "Auto-purchased"
  ): Promise<PurchaseResult[]> {
    console.log(`🔍 Searching for ${count} available numbers...`);
    
    // Search for available numbers (get double the count as buffer)
    const availableNumbers = await this.searchAvailableNumbers("US", areaCode, count * 2);

    if (availableNumbers.length < count) {
      console.warn(`⚠️ Warning: Only ${availableNumbers.length} numbers available, but ${count} requested`);
    }

    const purchaseResults: PurchaseResult[] = [];
    let purchasedCount = 0;

    for (let i = 0; i < availableNumbers.length && purchasedCount < count; i++) {
      const numberInfo = availableNumbers[i];
      const phoneNumber = numberInfo.phoneNumber;
      const friendlyName = `${friendlyNamePrefix} #${purchasedCount + 1}`;

      console.log(`📞 Attempting to purchase: ${phoneNumber}`);
      
      const result = await this.purchasePhoneNumber(phoneNumber, friendlyName);
      purchaseResults.push(result);

      if (result.success) {
        purchasedCount++;
        console.log(`✅ Successfully purchased: ${phoneNumber}`);
      } else {
        console.error(`❌ Failed to purchase: ${phoneNumber} - ${result.error}`);
      }

      // Add small delay to avoid rate limiting
      if (i < availableNumbers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return purchaseResults;
  }

  /**
   * Get account information and metadata
   */
  async getAccountInfo(): Promise<AccountInfo> {
    try {
      const account = await this.client.api.accounts(this.accountSid).fetch();

      return {
        accountSid: this.accountSid,
        authToken: this.authToken,
        friendlyName: account.friendlyName || undefined,
        status: account.status,
        type: account.type,
        dateCreated: account.dateCreated?.toISOString(),
        dateUpdated: account.dateUpdated?.toISOString()
      };

    } catch (error) {
      return {
        accountSid: this.accountSid,
        authToken: this.authToken,
        error: String(error)
      };
    }
  }

  /**
   * Display purchase results in a formatted way
   */
  displayResults(results: PurchaseResult[], accountInfo: AccountInfo): void {
    console.log("\n" + "=".repeat(60));
    console.log("📋 TWILIO PHONE NUMBER PURCHASE RESULTS");
    console.log("=".repeat(60));

    // Account Info
    console.log("\n🏢 ACCOUNT INFORMATION:");
    console.log(`   Account SID: ${accountInfo.accountSid}`);
    console.log(`   Auth Token: ${accountInfo.authToken}`);
    console.log(`   Status: ${accountInfo.status}`);
    console.log(`   Friendly Name: ${accountInfo.friendlyName || 'N/A'}`);

    // Successful purchases
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`\n✅ SUCCESSFULLY PURCHASED (${successful.length} numbers):`);
    successful.forEach((purchase, index) => {
      console.log(`\n   📞 Phone #${index + 1}: ${purchase.phoneNumber}`);
      console.log(`      SID: ${purchase.sid}`);
      console.log(`      Friendly Name: ${purchase.friendlyName}`);
      console.log(`      Account SID: ${purchase.accountSid}`);
      console.log(`      Auth Token: ${purchase.authToken}`);
      console.log(`      Capabilities:`);
      console.log(`         📞 Voice: ${purchase.capabilities?.voice ? '✓' : '✗'}`);
      console.log(`         📱 SMS: ${purchase.capabilities?.sms ? '✓' : '✗'}`);
      console.log(`         📷 MMS: ${purchase.capabilities?.mms ? '✓' : '✗'}`);
      console.log(`      Status: ${purchase.status}`);
      console.log(`      Created: ${purchase.dateCreated}`);
    });

    // Failed purchases
    if (failed.length > 0) {
      console.log(`\n❌ FAILED PURCHASES (${failed.length} numbers):`);
      failed.forEach((failure, index) => {
        console.log(`   ${index + 1}. ${failure.phoneNumber}: ${failure.error}`);
      });
    }

    // Summary
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Requested: ${results.length}`);
    console.log(`   Successful: ${successful.length}`);
    console.log(`   Failed: ${failed.length}`);
    console.log(`   Success Rate: ${((successful.length / results.length) * 100).toFixed(1)}%`);
  }
}

/**
 * Main function - Configure your settings here
 */
async function main(): Promise<void> {
  // ⚠️ REPLACE THESE WITH YOUR ACTUAL TWILIO CREDENTIALS ⚠️
  const ACCOUNT_SID = "your_account_sid_here";
  const AUTH_TOKEN = "your_auth_token_here";

  // 🔧 CONFIGURATION - Modify these settings
  const NUMBER_COUNT = 2;           // How many numbers to purchase
  const AREA_CODE: string | undefined = undefined;  // Set to "415", "212", etc. for specific area codes
  const FRIENDLY_NAME_PREFIX = "My Phone";  // Prefix for friendly names

  try {
    console.log("🚀 Starting Twilio Phone Number Purchase Process...\n");

    // Initialize purchaser
    const purchaser = new TwilioPurchaser(ACCOUNT_SID, AUTH_TOKEN);

    // Get account information first
    console.log("📋 Fetching account information...");
    const accountInfo = await purchaser.getAccountInfo();
    
    if (accountInfo.error) {
      console.error("❌ Error fetching account info:", accountInfo.error);
      console.error("   Please check your Account SID and Auth Token");
      return;
    }

    // Purchase numbers
    console.log(`💰 Purchasing ${NUMBER_COUNT} phone numbers...`);
    const results = await purchaser.purchaseMultipleNumbers(
      NUMBER_COUNT,
      AREA_CODE,
      FRIENDLY_NAME_PREFIX
    );

    // Display results
    purchaser.displayResults(results, accountInfo);

    // Create summary object for potential JSON export
    const summaryData = {
      purchaseDate: new Date().toISOString(),
      accountInfo: accountInfo,
      successfulPurchases: results.filter(r => r.success),
      failedPurchases: results.filter(r => !r.success),
      summary: {
        totalRequested: NUMBER_COUNT,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        areaCodeFilter: AREA_CODE || "Any"
      }
    };

    console.log("\n💾 Complete results object (ready for JSON export):");
    console.log(JSON.stringify(summaryData, null, 2));

    // If you want to save to file in Node.js environment, uncomment below:
    /*
    const fs = require('fs').promises;
    await fs.writeFile('twilio_purchase_results.json', JSON.stringify(summaryData, null, 2));
    console.log("\n📁 Results saved to 'twilio_purchase_results.json'");
    */

  } catch (error) {
    console.error("💥 Error in main function:", error);
    console.error("\nTroubleshooting tips:");
    console.error("1. Verify your Account SID and Auth Token are correct");
    console.error("2. Check your Twilio account balance");
    console.error("3. Ensure your Twilio account is verified");
  }
}

// Quick test function to verify credentials without purchasing
async function testCredentials(accountSid: string, authToken: string): Promise<boolean> {
  try {
    const purchaser = new TwilioPurchaser(accountSid, authToken);
    const accountInfo = await purchaser.getAccountInfo();
    
    if (accountInfo.error) {
      console.error("❌ Invalid credentials:", accountInfo.error);
      return false;
    }
    
    console.log("✅ Credentials are valid!");
    console.log(`   Account: ${accountInfo.friendlyName || accountInfo.accountSid}`);
    console.log(`   Status: ${accountInfo.status}`);
    return true;
  } catch (error) {
    console.error("❌ Error testing credentials:", error);
    return false;
  }
}

// Export classes and functions for use as module
export { TwilioPurchaser, testCredentials };
    export type { PurchaseResult, AccountInfo, AvailableNumber };

// Run main function if file is executed directly
if (require.main === module) {
  main().catch(console.error);
}