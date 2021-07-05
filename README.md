# aircallTools
This app allows Aircall users to update the Music and Message URLs for multiple numbers at once.

## How It Works
1. Login with your API ID and API Token 
2. Select which Music/Message you want to update.
3. Select all numbers you want to update to the new message.
4. Enter in a valid web URL to the MP3 file you want to use.

## FAQs
**Why can't I upload a MP3 file like I can through the Aircall Dashboard?**

This is due to how the Aircall API is designed. Only URLs can be associated with the music/message on a number. When you upload a MP3 file through the Dashboard, it is first uploaded to Aircall's server, a URL is generated for the file,
and then that URL is saved as the music/message for the number you updated.

**Where do I find my API ID and API Token?**

If you don't already have one, you can get one by following the steps in this article
https://developer.aircall.io/api-references/#basic-auth-aircall-customers

**Why is it called aircallTools if it can only do 1 thing?**

aircallTools is designed so that more "tools" can easily be added to it in the future to allow for more useful things to be done in Aircall. There is no ETA for when more tools will be added and the future tools are TBD.
