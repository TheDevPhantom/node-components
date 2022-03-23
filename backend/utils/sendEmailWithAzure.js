/*
Sends an email to a specified user
using the Microsoft Azure Graph API

Requirements:
  Packages:
    npm i axios
    npm i qs

  Env Variables:
    AZURE_TENANT
    AZURE_CLIENT_ID
    AZURE_SCOPE
    AZURE_CLIENT_SECRET
*/

import qs from "qs";
import axios from "axios";

export const sendEmail = async (options) => {
  var data = qs.stringify({
    grant_type: "password",
    tenant: process.env.AZURE_TENANT,
    client_id: process.env.AZURE_CLIENT_ID,
    username: options.from,
    password: options.password,
    scope: process.env.AZURE_SCOPE,
    client_secret: process.env.AZURE_CLIENT_SECRET,
  });

  try {
    const { data: results } = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT}/oauth2/v2.0/token`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (results.access_token) {
      const { data: emailData } = await axios.post(
        "https://graph.microsoft.com/v1.0/me/sendMail",
        {
          message: {
            subject: options.subject,
            body: {
              contentType: "HTML",
              content: options.message,
            },
            toRecipients: [
              {
                emailAddress: {
                  address: options.email,
                },
              },
            ],
          },
          saveToSentItems: true,
        },
        {
          headers: {
            Authorization: `${results.token_type} ${results.access_token}`,
          },
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};
