import React, { Component, Fragment } from "react";
import Cabecalho from "../../components/Cabecalho";
import NavMenu from "../../components/NavMenu";
import Dashboard from "../../components/Dashboard";
import Widget from "../../components/Widget";
import TrendsArea from "../../components/TrendsArea";
import Tweet from "../../components/Tweet";
import { Modal } from "../../components/Modal";

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      novoTweet: "",
      tweets: [],
      tweetAtivoNoModal: {},
    };
  }

  componentDidMount() {
    fetch(
      `https://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem(
        "TOKEN"
      )}`
    )
      .then((response) => response.json())
      .then((tweets) => {
        this.setState({
          tweets,
        });
      });
  }

  adicionaTweet = (infosDoEvento) => {
    infosDoEvento.preventDefault();
    if (this.state.novoTweet.length > 0) {
      fetch(
        `https://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem(
          "TOKEN"
        )}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ conteudo: this.state.novoTweet }),
        }
      )
        .then((respostaDoServer) => {
          return respostaDoServer.json();
        })
        .then((tweetVindoDoServidor) => {
          console.log(tweetVindoDoServidor);
          this.setState({
            novoTweet: "",
            tweets: [tweetVindoDoServidor, ...this.state.tweets],
          });
        });
    }
  };

  removeTweet(idTweetQueVaiSerRemovido) {
    console.log(idTweetQueVaiSerRemovido);
    fetch(
      `https://twitelum-api.herokuapp.com/tweets/${idTweetQueVaiSerRemovido}?X-AUTH-TOKEN=${localStorage.getItem(
        "TOKEN"
      )}`,
      {
        method: "DELETE",
      }
    )
      .then((data) => data.json())
      .then((response) => {
        console.log(response);
        const listaDeTweetsAtualizada = this.state.tweets.filter(
          (tweet) => tweet._id !== idTweetQueVaiSerRemovido
        );
        this.setState({
          tweets: listaDeTweetsAtualizada,
        });
        this.fechaModal();
      });
  }

  abreModal = (tweetQueVaiProModal) => {
    this.setState(
      {
        tweetAtivoNoModal: tweetQueVaiProModal,
      },
      () => {
        console.log(this.state.tweetAtivoNoModal);
      }
    );
  };

  fechaModal = () => this.setState({ tweetAtivoNoModal: {} });

  render() {
    return (
      <Fragment>
        <Cabecalho>
          <NavMenu usuario="@jessica" />
        </Cabecalho>
        <div className="container">
          <Dashboard>
            <Widget>
              <form className="novoTweet" onSubmit={this.adicionaTweet}>
                <div className="novoTweet__editorArea">
                  <span
                    className={`novoTweet__status ${
                      this.state.novoTweet.length > 140
                        ? "novoTweet__status--invalido"
                        : ""
                    }`}
                  >
                    {this.state.novoTweet.length}/140
                  </span>
                  <textarea
                    className="novoTweet__editor"
                    value={this.state.novoTweet}
                    onChange={(event) =>
                      this.setState({ novoTweet: event.target.value })
                    }
                    placeholder="O que está acontecendo?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="novoTweet__envia"
                  disabled={
                    this.state.novoTweet.length > 140 ||
                    this.state.novoTweet.length === 0
                  }
                >
                  Tweetar
                </button>
              </form>
            </Widget>
            <Widget>
              <TrendsArea />
            </Widget>
          </Dashboard>
          <Dashboard posicao="centro">
            <Widget>
              <div className="tweetsArea">
                {this.state.tweets.length === 0 ? (
                  <div>Faça um tweet</div>
                ) : (
                  this.state.tweets.map((tweetInfo, index) => {
                    return (
                      <Tweet
                        key={tweetInfo._id}
                        id={tweetInfo._id}
                        texto={tweetInfo.conteudo}
                        usuario={tweetInfo.usuario}
                        likeado={tweetInfo.likeado}
                        totalLikes={tweetInfo.totalLikes}
                        removivel={tweetInfo.removivel}
                        onClickNaAreaDeConteudo={() =>
                          this.abreModal(tweetInfo)
                        }
                        removeHandler={(event) =>
                          this.removeTweet(tweetInfo._id)
                        }
                      />
                    );
                  })
                )}
              </div>
            </Widget>
          </Dashboard>
        </div>
        <Modal
          isAberto={Boolean(this.state.tweetAtivoNoModal._id)}
          onFechando={this.fechaModal}
        >
          {() => (
            <Tweet
              key={this.state.tweetAtivoNoModal._id}
              id={this.state.tweetAtivoNoModal._id}
              texto={this.state.tweetAtivoNoModal.conteudo}
              usuario={this.state.tweetAtivoNoModal.usuario}
              likeado={this.state.tweetAtivoNoModal.likeado}
              totalLikes={this.state.tweetAtivoNoModal.totalLikes}
              removivel={this.state.tweetAtivoNoModal.removivel}
              onClickNaAreaDeConteudo={() =>
                this.abreModal(this.state.tweetAtivoNoModal)
              }
              removeHandler={(event) =>
                this.removeTweet(this.state.tweetAtivoNoModal._id)
              }
            />
          )}
        </Modal>
      </Fragment>
    );
  }
}

export default HomePage;
