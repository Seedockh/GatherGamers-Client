import React from 'react';
import FooterTabs from '../../components/FooterTabs'
import Tabbars from '../../components/Tabbars'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <>
                <Tabbars {...this.props}/>
                <FooterTabs {...this.props}/>
            </>
        );
    }
}