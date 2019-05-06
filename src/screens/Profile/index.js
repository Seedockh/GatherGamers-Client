import React from 'react';
import { View, Image } from 'react-native';
import { vmin } from 'react-native-expo-viewport-units';
import FooterTabs from '../../components/FooterTabs'
import CardEdit from './cardEdit'
import CardFix from './cardFix'
export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false
        }
    }

    onEditFalse() {
        this.setState({ edit: false })
    }

    onEditTrue() {
        this.setState({ edit: true })
    }
    
    render() {
        const { edit } = this.state

        return (
            
            <>
            <View style={{ marginTop: 48, marginBottom: 16 }}>
                <Image 
                    style={{ width: vmin(40), height: vmin(40), borderRadius: 50, alignSelf: "center" }}
                    source={require('../../../assets/rouge.jpg')}
                />
            </View>

            {!edit ? 
                <CardFix  onEditTrue={this.onEditTrue.bind(this)} />
                :
                <CardEdit  onEditFalse={this.onEditFalse.bind(this)} />
            }

            <FooterTabs {...this.props} />
            </>
        )
    }
}