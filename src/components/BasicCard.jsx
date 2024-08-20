import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import "../css/BasicCard.css";

function BasicCard({ data, type }) {
  return (
    <>
      {type === "productCard" && (
        <Card>
          <Card.Img variant="top" src={data.imageUrl} />
          <Card.Body>
            <Card.Title>{data.name}</Card.Title>
            <Card.Text>{data.description}</Card.Text>
            <div>
              <Button
                as={Link}
                to={`/productDetail/${data._id}`}
                variant="primary"
              >
                Ver más
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default BasicCard;
