import React from 'react';
import { View } from 'react-native';
import Style from '../../styles/games'
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