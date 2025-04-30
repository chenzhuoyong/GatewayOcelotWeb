export default {
  url: "/api/rules",
  method: "get",
  response: () => {
    return {
      code: 200,
      message: "Success",
      timeout: 6000,
      data: [
        { id: 1, name: "@cname", code: "001", rule: "{% 1:3!length!padLeft(4,0) %}{{'|'}}{{UserName|length}}" },
        { id: 2, name: "@cname", code: "002", rule: "{% 1:3!length!padLeft(4,0) %}{{'|'}}{{UserName|length}}" },
        { id: 3, name: "@cname", code: "003", rule: "{% 1:3!length!padLeft(4,0) %}{{'|'}}{{UserName|length}}" },
      ],
    };
  },
};
