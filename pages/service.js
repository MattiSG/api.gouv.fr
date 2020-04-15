import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import withErrors from '../components/hoc/with-errors';

import { getService, getAPI } from '../utils/api';

import constants from '../constants';

import Page from '../layouts/page';

import APICard from '../components/searchApis/apiCard';
import { HEADER_PAGE } from '../components';

const Service = ({
  title,
  description,
  link,
  apiList,
  content,
  screenshot,
}) => {
  return (
    <Page
      headerKey={HEADER_PAGE.SERVICES}
      title={title}
      description={`${title} est un exemple d’utilisation d'API du service public. ${description}`}
    >
      <section id="title" className="ui vertical center aligned segment">
        <div className="ui text container">
          <h1 className="ui inverted header">{title}</h1>

          <h2 className="ui inverted header">{description}</h2>

          <a
            className="large ui secondary button"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Accédez au service &nbsp;<i className="rocket icon"></i>
          </a>
        </div>
      </section>

      <div className="content-container content">
        <div className="ui stackable grid">
          <div className="row">
            <div className="five wide column">
              <h3 className="ui divider horizontal">
                {apiList.length > 1 ? 'Les API utilisées' : 'API utilisée'}
              </h3>
              <div className="ui segments">
                {apiList.map(api => (
                  <APICard
                    key={api.slug}
                    {...api}
                    url={`/api/${api.slug}`}
                    image={api.logo}
                  />
                ))}
              </div>
            </div>
            <div className="eleven wide column">
              <div className="markdown-body">
                <ReactMarkdown source={content} />
              </div>
              <div>
                <img
                  className="ui bordered rounded fluid image"
                  src={`/images/service-screenshot/${screenshot}`}
                  alt={`capture d'écran de ${title}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        #title {
          padding-top: 5%;
          padding-bottom: 5%;
          margin-bottom: 2%;
          background: ${constants.colors.backgroundBlueGradient};
        }

        h1 {
          padding: 0.2em 0;
        }

        h2 {
          padding: 0.2em 0;
        }

        .logoAPI {
          margin-top: 0.5em;
        }

        .markdown-body {
          border: none;
          -webkit-box-shadow: none;
          -moz-box-shadow: none;
          box-shadow: none;
          margin-top: 2em;
          margin-bottom: 2em;
        }

        .ui.segments {
          border: none;
        }

        .content {
          margin-bottom: 3em;
        }
      `}</style>
    </Page>
  );
};

Service.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  apiList: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  screenshot: PropTypes.string.isRequired,
};

Service.getInitialProps = async ({ query, res }) => {
  const { serviceId } = query;
  const service = await getService(serviceId);
  // not the cleanest but I cannot rewrite the whole APP
  if (service.status === 404 && res) {
    res.statusCode = 404;
    res.end('Cette page est introuvable');
    return;
  }

  const api = await Promise.all(service.api.map(api => getAPI(api)));

  return {
    ...service,
    apiList: api,
  };
};

export default withErrors(Service);
