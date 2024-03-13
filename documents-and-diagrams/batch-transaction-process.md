# Batch Transaction Processing
## General Info
1. A batch is a grouping of transactions for a time period (currently a weekly batch)
2. All transactions are transferred or deposited as a batch
3. Each batch will have a unique id provided by the application (mongodb id) and a friendly id that will default to something like "DayOfTheWeek-YYYY.MM.DD", but can be edited by the user
4. To the bank it is one large transfer/deposit.  To the application, it is a batching of smaller transactions
5. Currently, there are 2 types of batch transaction processes that occur:  Subsplash Transfers and Envelope Deposits
6. The smallest division we need to track is account assignment for contributions (Batch Amount = Total Transaction Value = Total Account Credit value.)
