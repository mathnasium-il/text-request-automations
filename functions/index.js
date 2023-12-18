const functions = require("firebase-functions");

exports.onReceiveNewWebLead = functions.firestore
  .document("/franchise-groups/z-frank")
  .onUpdate((change) => {
    const [prevWebLead, currWebLead] = [
      change.before.data().lastWebLeadReceived,
      change.after.data().lastWebLeadReceived,
    ];

    function formatDate(timestamp) {
      const newDate = new Date(timestamp);
      return `${
        newDate.getMonth() + 1
      }/${newDate.getDate()}/${newDate.getFullYear()}`;
    }

    function formatPhoneNumber(phoneStr) {
      if (phoneStr.length < 10 || phoneStr.length > 11) return phoneStr;

      const areaCode =
        phoneStr.length === 10
          ? phoneStr.substring(0, 3)
          : phoneStr.substring(1, 4);
      const prefix =
        phoneStr.length === 10
          ? phoneStr.substring(3, 6)
          : phoneStr.substring(4, 7);
      const lineNumber =
        phoneStr.length === 10
          ? phoneStr.substring(6, 10)
          : phoneStr.substring(7, 11);

      return `(${areaCode}) ${prefix}-${lineNumber}`;
    }

    const isChanged =
      JSON.stringify(prevWebLead) !== JSON.stringify(currWebLead);

    if (isChanged) {
      console.log(
        `New web lead received: ${currWebLead.firstName} ${currWebLead.lastName}`
      );

      const body = `Hi ${
        currWebLead.firstName
      }, Mathnasium here! We appreciate your interest in our programs, and a team member will be in touch with you within the next business day. In the meantime and if you haven't already done so, feel free to book a FREE trial session for ${
        currWebLead.studentNames.trim() || "your child"
      } with this link: ${currWebLead.center.link}`;

      const msgUrl = "https://api.textrequest.com/api/v3/messages";
      const contactUrl = `https://api.textrequest.com/api/v3/dashboards/${currWebLead.center.dashboardId}/contacts/${currWebLead.phone}`;

      const leadOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "7c557fa8f83b40649a3533bebf16bf8b",
        },
        body: JSON.stringify({
          from: currWebLead.center.phone,
          to: currWebLead.phone,
          body,
          sender_name: "Robot Jamal",
          status_callback: "https://eomkppa7j3q3fi4.m.pipedream.net",
        }),
      };

      const testOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "7c557fa8f83b40649a3533bebf16bf8b",
        },
        body: JSON.stringify({
          from: currWebLead.center.phone,
          to: "7736290679",
          body,
          sender_name: "Robot Jamal",
          status_callback: "https://eomkppa7j3q3fi4.m.pipedream.net",
        }),
      };

      const testOptions2 = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "7c557fa8f83b40649a3533bebf16bf8b",
        },
        body: JSON.stringify({
          from: currWebLead.center.phone,
          to: "7736290679",
          body: `${currWebLead.firstName.trim()} ${currWebLead.lastName.trim()}: Contact successfully saved in Text Request!\n\nPhone Number: ${formatPhoneNumber(
            currWebLead.phone
          )}`,
          sender_name: "Robot Jamal",
          status_callback: "https://eomkppa7j3q3fi4.m.pipedream.net",
        }),
      };

      const contactOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "7c557fa8f83b40649a3533bebf16bf8b",
        },
        body: JSON.stringify({
          first_name: currWebLead.firstName.trim(),
          last_name: currWebLead.lastName.trim(),
          display_name:
            `${currWebLead.firstName} ${currWebLead.lastName}`.trim(),
          is_suppressed: false,
          is_archived: false,
          is_blocked: false,
          suppressed_reason: null,
          note: `Web lead received on ${formatDate(currWebLead.date)}.`,
          // contact_tags: currWebLead.center.contactTags,
          custom_fields: [
            {
              id: currWebLead.center.customFieldId,
              value: currWebLead.studentNames.trim() || "your child",
            },
          ],
          is_resolved: false,
        }),
      };

      Promise.all([
        fetch(contactUrl, contactOptions)
          .then(() =>
            fetch(msgUrl, testOptions2)
              .then((res) =>
                console.log("Contact Saving API:", res.status, res.statusText)
              )
              .catch((err) => console.error(err))
          )
          .catch((err) => console.error(err)),
        fetch(msgUrl, leadOptions)
          .then((res) =>
            console.log("Message API (Lead):", res.status, res.statusText)
          )
          .catch((err) => console.error(err)),
        fetch(msgUrl, testOptions)
          .then((res) =>
            console.log("Message API (JR):", res.status, res.statusText)
          )
          .catch((err) => console.error(err)),
      ]);
    } else return;
  });
