import React from 'react';
import { View } from 'react-native';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text } from 'native-base';
import Tab1 from './Tabs/tabOne'
import Tab2 from './Tabs/tabTwo'
import Tab3 from './Tabs/tabThree'

export default class Tabbars extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <>
                <Header hasTabs />
                <Tabs>
                    <Tab heading={<TabHeading><Text>News</Text></TabHeading>}>
                        <Tab1 />
                    </Tab>
                    <Tab heading={<TabHeading><Text>My Events</Text></TabHeading>}>
                        <Tab2 />
                    </Tab>
                    <Tab heading={<TabHeading><Text>My Favorites</Text></TabHeading>}>
                        <Tab3 {...this.props} />
                    </Tab>
                </Tabs>
            </>
        );
    }
}