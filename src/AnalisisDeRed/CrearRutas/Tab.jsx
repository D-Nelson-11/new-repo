    import Tab from 'react-bootstrap/Tab';
    import Tabs from 'react-bootstrap/Tabs';
    import CrearRutas from './CrearRutas';
    import EditarRuta from '../EditarRutas/EditarRuta';

    function UncontrolledExample() {
    return (
        <Tabs
        defaultActiveKey="Crear"
        id="uncontrolled-tab-example"
        className="mb-3 mt-2"
        
        >
        <Tab eventKey="Crear" title="Crear">
            <CrearRutas />
        </Tab>
        <Tab eventKey="profile" title="Editar">
            <EditarRuta />
        </Tab>
        </Tabs>
    );
    }

    export default UncontrolledExample;