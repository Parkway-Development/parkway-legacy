# Personas
In software development, a persona is a fictional character created to represent a user type that might use a site, brand, or product in a similar way. Personas are used in the user-centered design process to help the development team understand and anticipate the needs of the users they are designing for. By embodying the characteristics, goals, and behavior patterns of the user group, a persona makes it easier for developers to keep the user's perspective in mind throughout the design and development process.

Personas typically include details such as demographic information, behavior patterns, goals, skills, attitudes, and the environment in which the persona operates. These details help in making decisions about design, functionalities, and features with a specific, rather than generic, user in mind.

To define a persona in our case, its a user that in a given moment needs a subset of functionality to accomplish a given task.

In each persona, you have a set of behaviors and responsibilities that go along with that.  For example, if Jordan is interacting with the application as the Worship Team Lead, he has different behaviors and needs than Jordan interacting with the app as the keyboardist.

## The Church Admin
The Church Admin is at the top level.  See and do anything in the app, overriding other's input.  They are responsible for all aspects of the application and can see all aspects of the application from the root church organization level down.

## The Team Lead
The Team Lead is responsible for a specific subsection of the church organization.  They typically have a group of team members that work with them to accomplish the team's goal, but it's not a requirement to have team memmbers to be a Team Lead.  A Team Lead can be considered the head of a particular ministry.

For a given segment of the the organization, there can be multiple Team Leads in a Co-Chair sort of set up.  If there are Co-Chairs, as far as the application goes, they are 100% equal.  What one can do, the other can do.

For Parkway, many of our Team Leads function as a couple (i.e. Jordan and Ellie).  It is important, however, to understand that each person must have their own designation as a Team Lead IF they intend to function in the app as a Team Lead.  In our example above as Jordan and Ellie, Ellie may not want to interact with the application as a Team Lead.  In that case, she becomes a Team Member.

## The Section Lead
A Section Lead is a bit of a unique beast.  Sticking with our Jordan and Ellie example, lets say that Ellie needs access to some of the management functions of a Team Lead in order to help Jordan, but does not want to get wrapped up in things like notifications that Jordan may get as the sole Team Lead.  In that event, she will need Team Lead access on some things, but not all things.

A Section Lead cannot exist outside the context of a Team.

## The Team Member and The Team Volunteer
A **Team Member** is someone that normally participates in, and helps execute the regular and special events of the team to which they belong.  A Team Member should be considered a "full-time" participant.

A **Team Volunteer** is someone that is not expected to participate in all regular or special eents.  They are typically recruited on an as-needed basis.  While it may seem that there is always the same group of volunteers, they are not assigned regular duties within the team, as some teams do not need a lot of people. in, and helps execute the regular and special events of the team to which they belong.  A Team Member should be considered a "full-time" participant.

Lets look at an example.

| Team | Team Leads | Section Lead | Team Members | Team Volunteers |
| --- | --- | --- | --- | --- |
| Worship Team | Jordan Yaden | none | Jennifer, Ellie, Lyndsey, Stephanie, Sydney, Laura, Larry, Greg, Scott, Josh, Jay | none |
| The Tribe | Jay and Kim | none | none | none |
| Single Mom's | Kim | none | Gail Drake | Barb Gill |

In the above scenarios:
- The Worship Team has all very regular Team Members, even though some of the singers swap in and out.  They dont have any Section Leads and no Team Volunteers
- The Tribe just has two Team Leads, no Section Leads, Team Members or Team Volunteers.
- Single Mom's has a Team Lead, no Section Lead, a Team Member and a Team Volunteer

So why all the heiarchy if they are not all needed?  Part of the process in the Christian life is to grow a deeper connection with Jesus, as well as your church family.  We want to encourage our congregants to get more and more involved.  Having a "promotion" process is a great way to get folks deeper involved. 

At the end of the day, it is up to each Team Lead to organize their team how they see best.  However, I intend to implement a "badging" scheme for different things, so you can see, on a church directory, who is what where to look for help.

## The Person (represented as a profile)
A profile is essentially a person.  I called them profiles because profile and profiles work better in code than person and people.  A profile lists everything about the person **EXCEPT** login information.  For our app, when a user creates an account, their user name is currently required to be their email address.  Email address provides a convient way to have global uniqueness, but it does not account for the fact that a person's email may change.  

A profile exists for someone that has interacted with the church in some way.  They could be a member, visitor, guest speaker, a company we do business with, a volunteer, etc.  A profile does not inherently imply that the person has ever used the web site for anything.

It is a critical distinction between the email address as an email address and an email address as a username.  The profile will contain an email address property.  The user account, as a matter of convenience, will also contain an email address property.  However, we will use the user.emailAddress property as the user name.  This allows us an easy way to automatically connect a Profile with a User account.

In the future, we may move away from that methodology.  We will, at a minimum, need to create a way for a person to change the email address used for their username.  So the key takeaway is that a person can change thier email address on file, but not their user name (even though it appears to be the same thing), without developer help, at least at this point.

## User
A User is simply someone who has created an account on the web site OR had an account created for them via invitation or registration on the Admin portal.  In the event that the account was made at the web site, they may be someone who just wants to see what all we are up to.  When they create a user account, we will try to match them to a profile we already have.  If we cannot match them to a profile, they will get a clean profile by default.  Every person has a profile, either because of some prior interaction with the church, or by creating a user account with no profile information to match on.
