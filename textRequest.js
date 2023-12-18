import {} from "dotenv/config";

export const CENTERS = {
  laGrange: {
    contactTags: ["693205b7-367c-4de9-a420-7f15ace4be80"],
    customFieldId: "385d5204-6d6f-4f7e-b395-2d23606ef744",
    dashboardId: 36314,
    link: "https://rebrand.ly/lagrange",
    phone: "7085826593",
  },
  mountProspect: {
    contactTags: ["c77ebc94-9c68-47a4-a1d4-a9df8b415cdf"],
    customFieldId: "e4b727ba-1641-4267-af60-67910e88fafe",
    dashboardId: 36315,
    phone: "8478189755",
    link: "https://rebrand.ly/mtprospect",
  },
  oakPark: {
    contactTags: ["83035168-e126-4408-a1a7-a4c131784e44"],
    customFieldId: "d3a15c6d-f6fe-4c24-bc89-d1bdc3020803",
    dashboardId: 36313,
    phone: "7086134007",
    link: "https://rebrand.ly/oprf",
  },
};

export const sendAlertMessage = async (center, body) => {
  const msgBody = `ALERT: ${body}`;

  const url = "https://api.textrequest.com/api/v3/messages";
  const data = {
    from: center.phone,
    to: "7736290679",
    body: msgBody,
    sender_name: "Robot Jamal",
    status_callback: "https://eomkppa7j3q3fi4.m.pipedream.net",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "7c557fa8f83b40649a3533bebf16bf8b",
    },
    body: JSON.stringify(data),
  });

  console.log("SMS API:", response.status, response.statusText);
};

const sendTestMessage = async (center) => {
  const msgBody = `Hi Jamal, Mathnasium here! We appreciate your interest in our programs, and a team member will be in touch with you within the next business day. In the meantime and if you haven't already done so, feel free to book a FREE trial for Goose with this link: ${center.link}`;

  const url = "https://api.textrequest.com/api/v3/messages";
  const data = {
    from: center.phone,
    to: "7736290679",
    body: msgBody,
    sender_name: "Robot Jamal",
    status_callback: "https://eomkppa7j3q3fi4.m.pipedream.net",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "7c557fa8f83b40649a3533bebf16bf8b",
    },
    body: JSON.stringify(data),
  });

  console.log("SMS API:", response.status, response.statusText);
  // console.log(response);
};

const saveTestContact = async (center) => {
  const url = `https://api.textrequest.com/api/v3/dashboards/${center.dashboardId}/contacts/7085755656`;

  const data = {
    first_name: "Jamal",
    last_name: "Riley",
    display_name: "Jamal Riley (Work)",
    is_suppressed: false,
    is_archived: false,
    is_blocked: false,
    suppressed_reason: null,
    note: "Test",
    contact_tags: [],
    custom_fields: [
      {
        id: center.customFieldId,
        value: "Goose",
      },
    ],
    is_resolved: false,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY,
    },
    body: JSON.stringify(data),
  });

  console.log("Create Contact API:", response.status, response.statusText);
  // console.log(response);
};

// sendTestMessage(CENTERS.oakPark);
// saveTestContact(CENTERS.oakPark);
