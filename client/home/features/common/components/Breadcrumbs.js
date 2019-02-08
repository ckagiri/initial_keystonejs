import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withBreadcrumbs } from 'react-router-breadcrumbs-hoc';
import styled, { css } from 'styled-components';

const Container = styled.ul`
    margin-left: 200px;
    height: 60px;
    position: fixed;
    line-height: 60px;
`;

const BreadcrumbItem = styled.li`display: inline-block;`;

const activeClassName = css`
    font-weight: 400;
`;

const BreadcrumbText = styled.span`
    font-weight: 300;
    font-size: 18px;
    color: #ffffff;
    margin: 0px 10px;
    text-overflow: ellipsis; 
`;

const BreadcrumbLink = styled(NavLink).attrs({
    activeClassName: 'active'
})`
    &.active {
        ${BreadcrumbText} {
            font-weight: 400;
        }
    }
`;

const TournamentDetailBreadcrumb = ({ name }) =>
    <BreadcrumbText>
        {name}
    </BreadcrumbText>;
const NewsDetailBreadcrumb = ({news}) =>
    <BreadcrumbText>
        {news.title}
    </BreadcrumbText>;
const mapStateToProps = state => ({
    name: state.competition.tournamentInfo.tournamentDetail.name,
    news: state.news.newsInfo.newsInfo
});
const ConnectedTournamentDetailBreadcrumb = connect(mapStateToProps)(
    TournamentDetailBreadcrumb
);
const ConnectedNewsDetailBreadcrumb = connect(mapStateToProps)(
    NewsDetailBreadcrumb
);

const routes = [
    { path: '/games', breadcrumb: () => <BreadcrumbText>挑戰</BreadcrumbText> },
    {
        path: '/games/:name/tournaments',
        breadcrumb: ({ match }) =>
            <BreadcrumbText>
                {match.params.name}
            </BreadcrumbText>
    },
    {
        path: '/games/:name/tournaments/:id',
        breadcrumb: () => <ConnectedTournamentDetailBreadcrumb />
    },
    { path: '/news', breadcrumb: () => <BreadcrumbText>MTG esport 新聞</BreadcrumbText>},
    {
        path: '/news/:id',
        breadcrumb: () => <ConnectedNewsDetailBreadcrumb />
    },
    { path: '/live', breadcrumb: () => <BreadcrumbText>直播</BreadcrumbText>},
    { path: '/live/channels', breadcrumb: () => <BreadcrumbText>頻道</BreadcrumbText>},
    { path: '/live/channels/:channelId/:channelName/:status',
      breadcrumb: ({ match }) =>
          <BreadcrumbText>
              {match.params.status.replace(/per25/g, '%').replace(/slash2F/g, '/')}
          </BreadcrumbText>
    },
    { path: '/live/games', breadcrumb: () => <BreadcrumbText>遊戲</BreadcrumbText>},
    { path: '/live/games/:gameName',
      breadcrumb: ({ match }) =>
          <BreadcrumbText>
              {match.params.gameName}
          </BreadcrumbText>
    },
    { path: '/live/games/:gameName/:channelId/:channelName/:status',
      breadcrumb: ({ match }) =>
          <BreadcrumbText>
            	{match.params.status.replace(/per25/g, '%').replace(/slash2F/g, '/')}
          </BreadcrumbText>
    },
];

const Breadcrumbs = ({ breadcrumbs }) =>
    <Container>
        {breadcrumbs.map(({ breadcrumb, path, match }, index) =>
            <BreadcrumbItem key={path}>
                <BreadcrumbLink to={match.url} exact>
                    {breadcrumb}
                </BreadcrumbLink>
                {index < breadcrumbs.length - 1 &&
                    <BreadcrumbText>▸</BreadcrumbText>}
            </BreadcrumbItem>
        )}
    </Container>;

export default withBreadcrumbs(routes)(Breadcrumbs);
