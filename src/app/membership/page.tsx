import Navbar from "@/app/(site)/Navbar";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function MembershipPage() {
  return (
    <div className="relative bg-black/20">
      {/* Background GIF */}
      <img
        src="/LandingPage/LandingBackground.jpg"
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      />


      <div>
        <Navbar />
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Membership</h1>
        <p className="text-lg text-gray-600">
          Welcome to our membership page! Here you can find information about our membership plans.
        </p>

      <Card style={{ width: '18rem' }}>
      {/*<Card.Img variant="top" src="holder.js/100px180" />*/}
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  
        {/* Add your membership content here */}
      </div>
    </div>
  );
}