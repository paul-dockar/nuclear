import React from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { Dropdown, Popup } from 'semantic-ui-react';
import { getSelectedStream } from '../../utils';

import styles from './styles.scss';

class QueuePopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
    this.container.click();
  }

  handleOpen() {
    this.setState({ isOpen: true });
  }

  handleClose() {
    this.setState({ isOpen: false });
  }

  rerollTrack(track) {
    let selectedStream = getSelectedStream(
      track.streams,
      this.props.defaultMusicSource
    );
    let musicSource = _.find(
      this.props.musicSources,
      s => s.sourceName === selectedStream.source
    );
    this.props.rerollTrack(musicSource, selectedStream, track);
  }

  renderStreamSourceDropdown() {
    let { track, musicSources, defaultMusicSource } = this.props;

    let dropdownOptions = _.map(musicSources, s => {
      return {
        key: s.sourceName,
        text: s.sourceName,
        value: s.sourceName,
        content: s.sourceName,
      };
    });

    let selectedStream = getSelectedStream(track.streams, defaultMusicSource);
    return (
      <div className={styles.stream_source}>
        <label>Source:</label>{' '}
        <Dropdown
          inline
          options={dropdownOptions}
          defaultValue={
            _.find(dropdownOptions, o => o.value === selectedStream.source)
              .value
          }
        />
      </div>
    );
  }

  renderStreamRefreshButton() {
    let { track } = this.props;
    return (
      <div className={styles.stream_buttons}>
        <a href="#" onClick={() => this.rerollTrack.bind(this)(track)}>
          <FontAwesome name="refresh" />
        </a>
      </div>
    );
  }

  renderStreamInfo() {
    let { trigger, track, musicSources, defaultMusicSource } = this.props;
    let selectedStream = getSelectedStream(track.streams, defaultMusicSource);
    return (
      <div className={styles.stream_info}>
        <div className={styles.stream_thumbnail}>
          <img alt="" src={selectedStream.thumbnail} />
        </div>
        <div className={styles.stream_text_info}>
          {this.renderStreamSourceDropdown()}
          <div className={styles.stream_title}>
            <label>Title:</label>
            <span>{selectedStream.title}</span>
          </div>
          <div className={styles.stream_id}>
            <label>Stream ID:</label>
            <span>{selectedStream.id}</span>
          </div>
        </div>
        {this.renderStreamRefreshButton()}
      </div>
    );
  }

  renderPopupTrigger() {
    let { trigger } = this.props;
    return (
      <div
        ref={element => {
          this.container = element;
        }}
      >
        {trigger}
      </div>
    );
  }

  render() {
    let { trigger, track, defaultMusicSource } = this.props;
    let selectedStream = getSelectedStream(track.streams, defaultMusicSource);

    return (
      <div onContextMenu={this.toggleOpen.bind(this)}>
        <Popup
          className={styles.queue_popup}
          trigger={this.renderPopupTrigger()}
          open={this.state.isOpen}
          onClose={this.handleClose.bind(this)}
          onOpen={this.handleOpen.bind(this)}
          hideOnScroll
          position="left center"
        >
          {track.streams && selectedStream ? (
            this.renderStreamInfo()
          ) : (
            <div className={styles.stream_info}>Stream still loading.</div>
          )}
        </Popup>
      </div>
    );
  }
}

export default QueuePopup;
