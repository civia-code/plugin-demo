# Civia Prototype Workflows
- The Network State Virtual Hackathon

## 1. Account creation workflow

<center>

```Mermaid
flowchart TB
    Start(((Start<br>new app)))-->LoginPage[[Login page]]
    LoginPage-->inputName(Input nickname and invite code)
    inputName-->inputPassword(Create login password)
    inputPassword-->accept(Create account)

    accept-->ProgressPage[[Progress page showing account creation steps:<br>Create account<br>Receive initial gas<br>Initialize account<br>Follow inviter and set as guardian]]

    ProgressPage-->|When done, switch to home page|HomePage[[Home page]]
    HomePage-->closePage(Close current browser tab)
    closePage-->openPlugin(Open Civia plugin)
    openPlugin-->PluginHomePage[[Plugin home page]]
    PluginHomePage-->Done(((Done)))
```
</center>


## 2. Follow friend workflow

<center>

```Mermaid
flowchart TB

    Start(((Start)))-->HomePage[[Home page]]
    HomePage-->FollowPage[[Followings page]]
    FollowPage-->clickPlus(Click '+' on the upper right)
    clickPlus-->menu[Menu]
    menu-->selectAddFriend(Follow friend)-->AddFriendPage[[Follow friend page]]
    
    AddFriendPage-->selectUser(View a list of Civia users)
    selectUser-->clickUser(Select friend to follow)
    clickUser-->UserHomePage[[See friend home page]]
    UserHomePage-->clickFollow(Click 'Follow')
    clickFollow-->ActivityPage[[Open Activity page to check status of the operation]]
    ActivityPage-->|Wait for the operation to finish|FollowPage2[[Followings page, check followings in the list]]
    FollowPage2-->clickFollowedUser(Click the '>' to the right of the followed friend)
    clickFollowedUser-->UserHomePage2[[Friend's home page, check the button 'Followed']]
    UserHomePage2-->Done(((Done)))
```
</center>


## 3. Guardian setup workflow

<center>

```Mermaid
flowchart TB

    Start(((Start)))-->HomePage[[Home page]]
    HomePage-->clickPlus(Click '+' to the upper right)
    clickPlus-->menu[Menu]
    menu-->selectSecurityLevel(Select 'Guardians')-->SecurityLevelPage[[Guardians page]]
    SecurityLevelPage-->setLevel(Set higher security level to allow for more guardians)
    setLevel-->clickUser(Click user icon in the list to see their home page)
    clickUser-->confirm{Confirm the user to be<br> set as a guardian}
    confirm-->selectId1(Select the user as guardian)
    selectId1-->loop(Select another user as guardian)
    loop-->selectDone[Finish]
    selectDone-->clickSubmit(Click 'Submit')

    clickSubmit-->ActivityPage[[Open Activities page to see the progress of the operation]]
    ActivityPage-->|Wait for the operation to finish|HomePage2[[Check that the security alert on the home page disappears]]
    HomePage2-->Done(((Done)))

```

</center>

## 4. Social recovery workflow

<center>

```Mermaid

flowchart TB

    Start(((Start)))-->runNewChrome[[Start a new Chrome instance]]
    runNewChrome-->installCivia((Install Civia<br> Chrome extension))
    installCivia-->LoginPage[[Create account page]]
    LoginPage-->clickSocialRecovery(Click 'Social Recovery')
    clickSocialRecovery-->SocialRecoveryPage[[Social Recovery page]]

    SocialRecoveryPage-->inputUserId(View the list of user accounts)
    inputUserId-->clickUser(Select the user account to recover)

    clickUser-->inputGuardians(View the list of guardians)
    inputGuardians-->clickGuardians(Select 2 guardians out of 3)

    clickGuardians-->|Confirm 2 guardians selected|clickSubmit(Click 'Submit recovery request')
    clickSubmit-->ProgressPage[[Check operation progress in Activities<br>Contact guardians offline to remind them of the recovery request they will see in their app]]

    ProgressPage-->|Wait for guardians to finish their signings|HomePageOwner[[Show the main page of the recovered account<br> with previous SBTs and followings]]
    HomePageOwner-->Done(((Done)))

```
</center>