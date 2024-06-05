# Authentication and Authorization
## Authentication
We currently offer 1 form of authentication, which is jwt's.  We will soon be adding in 2 more: Service Principles and API Tokens.

Currently, all api's require authentication other than signup and login.  That means that our security goes down to the user level.  If a person with bad intent manages to get a high enough set of user credentials, they could hit our endpoints without our knowing that somthing is amiss.  Additionally, testing becomes cumbersome.  We want to move to a more secure architecture.

| JWT | Service Principle | API Token |
| --- | --- | --- |
| For user based access and gathering information about a user | For front end applications (web, admin, mobile, etc.) to communicate with the backend | To authenticate a call as coming from an allowed source, track its utilization and lock it out if necessary. |

## Authorization
Authorization provides details about what a user can do inside each of the UI based components.  They are implemented via a claims structure involving roles and permissions.
### Roles
Roles apply to different areas and to different teams.  For example, if you have the role "admin", you can do anything and see everything, short of direct database or code access.  If you have the role "teammember", you will have a list of 1 or more teams that allow you access to different parts of the application (see groups)

Each of the roles listed below, and the corresponding areas, allow the user to do different things.  For example, someone with the accounting role, can access all areas of the accounting system, including budgeting.  Someone with the teamsmanagement role can create a team, delete a team and assign leaders to a team, but cannot see the accounting system.

| Area | admin | memberadmin | accountingadmin | teamsadmin | calendaradmin | prayeradmin | mediaadmin |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| System Settings | X | | | | | | |
| Member Vetting | X | | | | | | |
| User Management | X | X | | | | | |
| Accounting | X |  | X | | | | |
| Budgeting | X |  | X | | | | |
| Teams Management | X | | | X | | | |
| Calendar Management | X | | | | X | | |
| Prayer Management | X | | | | | X | |
| Media Management | X | | | | | | X |
| Social Media Management | X | | | | | | X |

These roles are flexible, in that we can expand or contract the list as needed.  This is just a starting point.
