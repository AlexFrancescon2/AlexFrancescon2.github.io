# Votebot assignment

### Introduction

VoteBot is a simple single page application divided in three sections:
- On the first section, the user can create and edit a poll with up to 10 options. 
- On the second, the central one, the user can vote by selecting one of the options and pressing the "vote" button. 
- On the third in the right, the chart will dynamically update basing on the questions created and the votes that each question got.
A Demo can be reached [through this link](https://alexfrancescon2.github.io/).

This project has been developed with the goal of following the requests indicated in the assigment as best as possible, making up assuptions when necessary.

The app has been developed with HTML, CSS and JavaScript.

### Assumptions and instructions
On first load, the app will show an **header** and **three different sections**, two of them empty. 

On the header there is the Logo and a "Simulate" button, which I used to create a title and 10 questions during the testing process.

On the first (left) section, the user can enter the **title** of the poll, and up to **10 possible answers** by entering the value in the 'Anwers' input and clicking on the 'Add' button on its right. When created, it will be created a new Answer object that will store a progressive numeric ID that will identify the answer, and the content (text) of the answer - what the user typed. The logic avoids blank (empty) answers to be created. 
This answer will be displayed above the input, with the possibility to update or remove it. 

At the botom of the section, there will be a **'reset' button**. By clicking it, after to confirm the operation through the designated popup, it will reset all the three components and restore the app to the original status.

On the second component there will be displayed the title of the poll and a list of radio button for each possible answer entered by the user. 

For this section, the assuption made is that the poll should not exist - or at least, be visible by the voting user - untill at least the title or two options (possible answers) have been created - the **minimum requirement**. According to this, the second section (and also the third one) can toggle its content visibility according to the operations made on the first section: could be in the interest of the user (poll creator) to remove one possible answer and enter a new one, creating an interval of time where only one possible answer is available. 

Of course would have been better to handle this situation by using a 'Create' button, which would allow the user to create and update the poll once ready, but has been decided to discard this possibility, as it was not deemed to be the assigment request. On contrary, every component changes dynamically by updating the data in the first section.

After to select one of the possible answers in the second section (by toggling the radio buttons), it's possible to vote the answer by clicking on the 'vote' button. By doing this, it will be created a new AnsweredQuestion object, which will store the relative answer ID (referring to the selected answer object) and the amount - a counter which will indicates the number of votes for this answer). If it was the first vote, a new poll chart will be created. Otherwise, the chart will be updated withy the new values.
The chart gets created and updated thanks to a merge of the values of the two aforementioned objects (Answers and AnsweredQuestions), linked by the common answer numeric ID, which will results in an array containing the ID, the amount of votes and the text (content) of the answer.

The chart poll's Y axis (votes) changes dynamically its referenced unit of measure, giving a better experience with big numbers. Also, by hovering the cart poll's bars, it will be visible a tooltip that indicates the current amount of votes for the bar.

It's important to point out another assumption: If the user modifies one of the possible questions, it's on its interest to mantain the status of the poll (and its possible answers) and just modify the text (content). According to this, this content will change dynamically in all the two other components. 
On the contrary, by removing one of the possible answers, the user plausibly wants to remove it from the poll as well; in this case, both the radio list and the poll chart will be updated by removing this option.

Alex Francescon
