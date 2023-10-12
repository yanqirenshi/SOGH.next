const query = `{
  user (login: "@user-login") {
    id
    projectV2 (number: @projectv2-number) {
      id
      title
    }
  }
}`;

export default query;
