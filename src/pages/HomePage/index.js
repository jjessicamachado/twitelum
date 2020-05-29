import React, { Component, Fragment } from "react";
import Cabecalho from "../../components/Cabecalho";
import NavMenu from "../../components/NavMenu";
import Dashboard from "../../components/Dashboard";
import Widget from "../../components/Widget";
import TrendsArea from "../../components/TrendsArea";
import { TweetsService } from "../../services/TweetsService";
import { TweetsContainer } from "../../containers/TweetsContainer";
import { ReactReduxContext } from "react-redux";
import { TweetsThunkActions } from "../../store/ducks/tweets";

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      novoTweet: "",
      totalTweets: 0,
    };
  }

  static contextType = ReactReduxContext;

  componentDidMount() {
    const store = this.context.store;

    store.subscribe(() => {
      this.setState({
        totalTweets: store.getState().tweets.data.length,
      });
    });
  }

  adicionaTweet = (infosDoEvento) => {
    infosDoEvento.preventDefault();
    if (this.state.novoTweet.length > 0) {
      const conteudoDoTweet = this.state.novoTweet;
      this.context.store
        .dispatch(TweetsThunkActions.addTweet(conteudoDoTweet))
        .then(() => {
          this.setState({ novoTweet: "" });
        });
    }
  };

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
              <TweetsContainer />
            </Widget>
          </Dashboard>
        </div>
      </Fragment>
    );
  }
}

export default HomePage;
