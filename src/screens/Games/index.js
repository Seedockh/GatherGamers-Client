import React from 'react';
import FooterTabs from '../../components/FooterTabs'
import ListGames from './listgames'

export default class Games extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <>
                <ListGames {...this.props} />
                <FooterTabs {...this.props} />
            </>
        );
    }
}