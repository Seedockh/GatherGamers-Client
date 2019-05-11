import React from 'react';
import { View } from 'react-native';
import { Tab, Tabs, TabHeading, Text } from 'native-base';
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
                <View style={{ height: 24 }}></View>
                <Tabs tabBarUnderlineStyle={{ backgroundColor: "white"}}>
                    <Tab style={{ backgroundColor:"white"}} heading={<TabHeading style={{ backgroundColor:"black"}}><Text style={{color:"white"}}>My News</Text></TabHeading>}>
                        <Tab1 />
                    </Tab>
                    <Tab heading={<TabHeading style={{ backgroundColor:"black"}}><Text style={{color:"white"}}>My Events</Text></TabHeading>}>
                        <Tab2 {...this.props}/>
                    </Tab>
                    <Tab heading={<TabHeading style={{ backgroundColor:"black"}}><Text style={{color:"white"}}>My Favorites</Text></TabHeading>}>
                        <Tab3 {...this.props} />
                    </Tab>
                </Tabs>
            </>
        );
    }
}