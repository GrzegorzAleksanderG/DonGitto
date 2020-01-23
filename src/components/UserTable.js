import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class UserTable extends React.Component{
    state = {};

    componentDidMount(){
        const urlOrgs = `https://api.github.com/organizations`;

        try{
            if(!this.state.organizations){
                fetch(urlOrgs).then(
                    response => response.json()).then(
                    organizations => {
                        this.setState({organizations});
                    }
                );  
            }   
        }catch(error){
            console.log(error);            
        }
    }

    onClickGetMembers = async ()=>{
        const selectedOrg = document.getElementById("selected_org").value;
        let _members = [];
        if(selectedOrg){
            try{
                const urlMember = `https://api.github.com/orgs/${selectedOrg}/members`;
                await fetch(urlMember).then(
                    response => response.json()).then(
                    members => {
                        _members = members;
                    }
                );  
            }catch(error){
                console.log(error);            
            }
            if(_members && _members.length !== 0){
                let _membersAndEvents = [];
                try{                    
                    _members.forEach(async (element)=>{
                        const urlEvents = `https://api.github.com/users/${element.login}/events/public`;
                        await fetch(urlEvents).then(
                            response => response.json()).then(
                                membersAndEvents => {
                                    let lastEvent = "";
                                    let lastDate = "";
                                    membersAndEvents.forEach((el)=>{
                                        if(lastEvent === "" || Date.parse(el.created_at)>Date.parse(lastDate)){
                                            lastEvent = el.type;
                                            lastDate = el.created_at;
                                        }
                                    });
                                    _membersAndEvents.push({
                                        id: element.id,
                                        login: element.login,
                                        org: selectedOrg,
                                        event: lastEvent
                                    })
                                    this.setState({membersAndEvents: _membersAndEvents});
                            }
                        );  
                    });                
                    
                }catch(error){
                    console.log(error);            
                }
            }else{
                this.setState({membersAndEvents: []});
            }
        }    
    }

    render(){
        return (
            <>
                <div className="form-row">
                    <div className="form-group col-md-8">
                        {this.state.organizations && <select className="form-control" id="selected_org">{this.state.organizations.map((element)=>{return(<option key={element.id}>{element.login}</option>)})}</select>}     
                    </div>
                    <div className="form-group col-md-4">
                        <input type="button" value="Get members" className="btn btn-secondary form-control" onClick={this.onClickGetMembers.bind(this)}></input>  
                    </div>
                </div>
                {this.state.membersAndEvents && 
                <table className="table table-striped">
                    <thead><tr><th>Login</th><th>Organization</th><th>Last public event</th></tr></thead>
                    <tbody>{this.state.membersAndEvents.map((element)=>{
                        return(<tr key={element.id}><td>{element.login}</td><td>{element.org}</td><td>{element.event}</td></tr>)})}
                    </tbody>
                </table>} 
            </>
        )
    }
}
export default UserTable;