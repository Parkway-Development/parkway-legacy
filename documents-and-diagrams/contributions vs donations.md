
# Contributions and Donations
### A *contribution* is considered a cash gift to the church that:
- **ARE** recorded in the transaction ledger
- **ARE** included in a batch deposit
- **DO** directly impacts monetary balances in any account
- **ARE** eligible for tax credits
- Tithes and Offerings are typical examples of a contribution

### A *donation* is to be considered a non-cash gift of either products and/or services to the church.  These can be thought of as "off the books" in a way.  They come in a few flavors.
- **Standard**
    - This is the most typical.
    - In this case:
      - Someone gives the church something and does not want tax credit for it.
      - Someone gives the church something and cannot prove the value of it with a receipt.
    - These types of donations may or may not be recorded in the system.
    - IF IT IS RECORDED AS A DONATION:
      - The donation input screen should have an option to print a form letter with a place for the donor to fill in their perceived value.  Other contents tbd.
      - When a donation is later pulled up, we need to be able to print another form letter with the original date of donation.
      - We flag this donation record as type "standard"
- **Tax Credit Donation**
  - The donor **DOES** have a receipt to prove the value of the item.  We mark this donation record as type "taxable"
  - This type of donation operates more like tithes or regular income for the Church.
    - An account to credit it to must be selected or created if it does not exist.
    - If an account can not be selected or created at the time of the record, the record must go into a pending status to be assigned later.
  - This **DOES** hit the ledger, with the donation attached to the donors profile.
  - When the donation is consumed (given to someone, used for the common good, etc.) a transaction against the value of that donation is made until the donated materials is gone (has $0 value)

**Example**

Jill goes to Kroger and purchases 5 $25 gift cards.  She donates those to the church for the church to hand out to those in need of groceries.

- When the church receives them, along with the receipt, 
  - A $125 credit is applied to the ledger
  - That credit is recorded as a donation on Jill's profile.
- The church gives out 2 of the $25 gift cards
  - A $50 debit is recorded against the donation, reducing the remaining value of the donation to $75. 
- The church gives out the 3 remaining gift cards
  - A $75 debit is recorded against the donation, reducing the remaining value of the donation to $0.  That donation cannot be used again.