# Authentication and Authorization
## Authentication
We currently offer 1 form of authentication, which is jwt's.  We will soon be adding in 2 more: Service Principles and API Tokens.

Currently, all api's require authentication other than signup and login.  That means that our security goes down to the user level.  If a person with bad intent manages to get a high enough set of user credentials, they could hit our endpoints without our knowing that somthing is amiss.  Additionally, testing becomes cumbersome.  We want to move to a more secure architecture.

| JWT | Service Principle | API Token |
| --- | --- | --- |
| For user based access and gathering information about a user | For front end applications (web, admin, mobile, etc.) to communicate with the backend | To authenticate a call as coming from an allowed source, track its utilization and lock it out if necessary. |

## Authorization
Authorization provides details about what a user can do inside each of the UI based components.  They are implemented via a claims structure involving roles and permissions.

### Organization Roles
Roles apply to different areas and to different teams.  For example, if you have the role "admin", you can do anything and see everything, short of direct database or code access.  If you have the role "teammember", you will have a list of 1 or more teams that allow you access to different parts of the application.

Application roles serve as the least granular method of authorization.  If you are an area admin, like a *memberadmin*, you have access to all of the functions in that area of the application.  If a person needs to only have access to a subset of the area admin role, you can assign individual claims.

It is important to note that these roles are organization wide.  They allow how the different areas of the app function for the entire organization.  Different areas may have broad and deep pallets, while others may be very narrow and shallow.

| Area | orgadmin | memberadmin | accountingadmin | teamsadmin | calendaradmin | prayeradmin | mediaadmin |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| System Settings | X | | | | | | |
| User Management | X | X | | | | | |
| Profile Management | X | X | | | | | |
| Accounting | X |  | X | | | | |
| Budgeting | X |  | X | | | | |
| Teams Management | X | | | X | | | |
| Calendar Management | X | | | | X | | |
| Prayer Management | X | | | | | X | |
| Media Management | X | | | | | | X |
| Social Media Management | X | | | | | | X |

These roles are flexible, in that we can expand or contract the list as needed.  This is just a starting point.

### Application Claims
If we think of the different areas of the application as a suite of micro-services, it may help clarify things.  Application Roles are for folks that will be managing the different micro-services.  Application claims detail what a user can do within that micro-service.  Lets take a look at user administration.

Lets create 2 fictional users: Jack and Jill.  Jack is the *orgadmin* and Jill is a *memberadmin*.

| User | Assign MemberAdmin | MemberAdmin Manager | Create a User | Activate/Deactivate a User | Delete a User | Modify a User | Create a Profile | Delete a Profile | Modify a Profile | Connect a User and an Profile |
| --- | :---: | :---: |:---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Jack | X | X | X | X | X | X | X | X | X | X |
| Jill |   | X | X | X | X | X | X | X | X | X |

Jack, as the *orgadmin*, can perform any user administration function in the system as well as assign the *memberadmin* role to another user.  Jill however, having only the role of *memberadmin* cannot add assign the *memberadmin* role to another user.

As the church grows, Jill need's help and Jim volunteers to help her out.  Jill only wants Jim to work with the profiles, but NOT be able to connect a profile to a user.  Since Jill cannot assign the *memberadmin* role, she goes to Jack and asks him to add Jim into the mix with access to only those functions.  When Jack adds Jim to the *memberadmin* role, he has to ensure that he removes any of the claims Jill does not want him to have.

| User | Assign MemberAdmin | MemberAdmin Manager | Create a User | Activate/Deactivate a User | Delete a User | Modify a User | Create a Profile | Delete a Profile | Modify a Profile | Connect a User and an Profile |
| --- | :---: | :---: |:---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Jack | X | X | X | X | X | X | X | X | X | X |
| Jill |   | X | X | X | X | X | X | X | X | X |
| Jim |  |  |  |  |  |  | X | X | X | X |

As the church continues to grow, Jill now wants Jim to do all the Member Admin functions, except grant the *memberadminmanager* claim. Jim's daughter Judy will take over Jim's old function.  Jill, having the *memberadminmanager* claim, can grant the *memberadminmanager* claim to Jim, but that would allow Jim to not only perform all the other functions, but to also grant the *memberadminmanager* claim to other users.  So Jill grants all of the claims, except the *memberadminmanager* claim to Jack.  However, since Jill is still not an *orgadmin*, Jill reaches out to Jack to add Judy with the same permissions as Jim's old role.

| User | Assign MemberAdmin | MemberAdmin Manager | Create a User | Activate/Deactivate a User | Delete a User | Modify a User | Create a Profile | Delete a Profile | Modify a Profile | Connect a User and an Profile |
| --- | :---: | :---: |:---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Jack | X | X | X | X | X | X | X | X | X | X |
| Jill |   | X | X | X | X | X | X | X | X | X |
| Jim |  |  | X | X | X | X | X | X | X | X |
| Judy |  |  |  |  |  |  | X | X | X | X |

Using this methodology, Jack alone can place someonen in the *memberadmin* role.  By default, both Jack and Jill can grant application claims to other individuals as needed.  Once a user is in the particular role, they cannot grant themselves the *admin* claim.  Only another person with *admin* claim can do that.

By providing a deep granularity to permissions and access, we can provide deep levels of control and permisability.

By default, assigning a user to a role gives them all the associated claims for that role.  However, we will need to be able to uncheck those claims that are deemed not necessary.
