const TWEETS_URL = "https://twitelum-api.herokuapp.com/tweets/";

export const TweetsService = {
  carrega: () =>
    fetch(
      `${TWEETS_URL}?X-AUTH-TOKEN=${localStorage.getItem("TOKEN")}`
    ).then((response) => response.json()),

  adiciona: (conteudo) =>
    fetch(`${TWEETS_URL}?X-AUTH-TOKEN=${localStorage.getItem("TOKEN")}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ conteudo }),
    }).then((respostaDoServer) => {
      return respostaDoServer.json();
    }),

  remove: (idTweetQueVaiSerRemovido) =>
    fetch(
      `${TWEETS_URL}${idTweetQueVaiSerRemovido}?X-AUTH-TOKEN=${localStorage.getItem(
        "TOKEN"
      )}`,
      {
        method: "DELETE",
      }
    ).then((data) => data.json()),

  like: (idDoTweet) =>
    fetch(
      `${TWEETS_URL}/${idDoTweet}/like?X-AUTH-TOKEN=${localStorage.getItem(
        "TOKEN"
      )}`,
      { method: "POST" }
    ).then((response) => response.json()),
};
