import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Mail,
  Rocket,
  Code2,
  Users,
  ArrowRight,
  GraduationCap,
  Database,
  Monitor,
} from "lucide-react";
import "./About.css";

export default function About() {
  const teamMembers = [
    {
      name: "Gabani Swet",
      role: "Full Stack Developer",
      image: "../../../Private/swet.png",
      description:
        "Worked on the development and integration of the IdeaDock platform and backend functionality, APIs, database operations, and server logic.",
      skills: ["React", "Node.js", "MongoDB", " Express", "JavaScript", "CSS"],
    },
    {
      name: "Bhadani Rushank",
      role: "Frontend Developer",
      image: "../../../Private/rushank.png",
      description:
        "Worked on the frontend interface, responsive design, and user experience.",
      skills: ["React", "JavaScript", "CSS"],
    },
    {
      name: "Gadhiya Krishna",
      role: "Tester & QA",
      image: "../../../Private/krishna.png",
      description:
        "Worked on testing the platform, identifying bugs, and ensuring the quality of the application.",
      skills: ["Node.js", "Express", "MongoDB", "testing"],
    },
  ];

  return (
    <div className="about-page">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="about-hero">
        <div className="about-badge">
          <GraduationCap className="about-badge-icon" />
          <span>COLLEGE MINOR PROJECT</span>
        </div>

        <h1>
          IdeaDock
          <br />
          <span>Connecting Ideas & People.</span>
        </h1>

        <p>
          A college minor project designed to help students, founders, and
          aspiring entrepreneurs discover startup ideas and connect with people
          who have the skills and interests needed to build them.
        </p>
      </section>

      {/* =====================================================
          PROJECT INFORMATION
      ===================================================== */}
      <section className="project-info-section">
        <div className="about-section-label">
          <GraduationCap size={15} />
          PROJECT INFORMATION
        </div>

        <div className="project-info-grid">
          <div className="project-info-card">
            <span className="project-info-number">01</span>
            <span className="project-info-label">PROJECT</span>
            <h3>IdeaDock</h3>
            <p>College Minor Project</p>
          </div>

          <div className="project-info-card">
            <span className="project-info-number">02</span>
            <span className="project-info-label">COURSE</span>
            <h3>BCA</h3>
            <p>Computer Applications</p>
          </div>

          <div className="project-info-card">
            <span className="project-info-number">03</span>
            <span className="project-info-label">PROJECT TYPE</span>
            <h3>Web Application</h3>
            <p>Full Stack Development</p>
          </div>

          <div className="project-info-card">
            <span className="project-info-number">04</span>
            <span className="project-info-label">TEAM</span>
            <h3>3 Members</h3>
            <p>Student Development Team</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT PROJECT
      ===================================================== */}
      <section className="about-platform">
        <div className="about-section-label">
          <Code2 size={15} />
          ABOUT THE PROJECT
        </div>

        <div className="about-platform-grid">
          <div>
            <h2>
              More than a
              <br />
              college project.
            </h2>
          </div>

          <div>
            <p>
              IdeaDock is a web-based platform developed as a college minor
              project. The main purpose of the project is to provide a place
              where users can discover startup ideas and connect with people who
              may be interested in working on them.
            </p>

            <p>
              The platform allows users to explore startups, view details,
              discover required skills, send join requests, manage their
              profiles, and interact with startup opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECT OBJECTIVE
      ===================================================== */}
      <section className="about-why">
        <div className="about-section-label">
          <Users size={15} />
          PROJECT OBJECTIVE
        </div>

        <div className="about-why-card">
          <div className="about-number">01</div>

          <div>
            <h2>Why we built IdeaDock</h2>

            <p>
              Many students have interesting ideas but may not have all the
              skills or team members required to turn those ideas into reality.
            </p>

            <p>
              IdeaDock attempts to solve this problem by providing a platform
              where people can discover startup opportunities and connect with
              others based on their skills and interests.
            </p>

            <div className="objective-list">
              <div>
                <span>01</span>
                Discover startup ideas
              </div>

              <div>
                <span>02</span>
                Find people with relevant skills
              </div>

              <div>
                <span>03</span>
                Send and manage join requests
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TECHNOLOGIES
      ===================================================== */}
      <section className="technology-section">
        <div className="about-section-label">
          <Monitor size={15} />
          TECHNOLOGIES USED
        </div>

        <div className="technology-grid">
          <div className="technology-card">
            <div className="technology-icon">
              <Code2 size={20} />
            </div>

            <h3>Frontend</h3>

            <p>React.js, JavaScript, HTML, CSS</p>
          </div>

          <div className="technology-card">
            <div className="technology-icon">
              <Database size={20} />
            </div>

            <h3>Backend</h3>

            <p>Node.js, Express.js</p>
          </div>

          <div className="technology-card">
            <div className="technology-icon">
              <Database size={20} />
            </div>

            <h3>Database</h3>

            <p>MongoDB</p>
          </div>

          <div className="technology-card">
            <div className="technology-icon">
              <Rocket size={20} />
            </div>

            <h3>Development</h3>

            <p>Git, GitHub, REST APIs</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          TEAM
      ===================================================== */}
      <section className="creator-section">
        <div className="about-section-label">
          <Users size={15} />
          MEET THE TEAM
        </div>

        <p className="team-intro">
          IdeaDock was developed by a team of four students as part of their
          college minor project.
        </p>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="team-image-wrapper">
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-image"
                />
              </div>

              <div className="team-content">
                <div className="creator-role">{member.role}</div>

                <h2>{member.name}</h2>

                <p className="creator-description">{member.description}</p>

                <div className="creator-skills">
                  {member.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          PROJECT OUTCOME
      ===================================================== */}
      <section className="outcome-section">
        <div className="about-section-label">
          <Rocket size={15} />
          PROJECT OUTCOME
        </div>

        <div className="outcome-card">
          <div className="outcome-number">04</div>

          <div>
            <h2>Learning through development.</h2>

            <p>
              Developing IdeaDock gave our team practical experience in frontend
              development, backend development, database management,
              authentication, API integration, UI design, and collaborative
              software development.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
