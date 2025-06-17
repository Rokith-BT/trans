import React, { FC } from "react";
import './Card.scss';

type Status = "Active" | "Pending Approval" | "Expired";

const statusStyles: Record<Status, string> = {
    Active: "badge active",
    "Pending Approval": "badge pending",
    Expired: "badge expired",
};

interface CardProps {
    onViewLicense?: () => void;
}

const Card : FC<CardProps> = ({
    onViewLicense
}) => {
    return (
        <div className="card">
            <div className="card-header">
                <span className="serial">S.No. {'01'}</span>
                {/* <span className={statusStyles[status]}>{status}</span> */}
                <span className={statusStyles['Active']}>{status}</span>
            </div>

            <div className="card-body">
                <p className="ref-no">
                    <strong>Organ Reference Number:</strong> {'1234567890'}
                </p>

                <div className="info">
                    <span className="icon">{"❤️"}</span>
                    <span className="name">{"Heart"}</span>
                    <div className="license-dates">
                        <div>
                        <small>License Issue Date</small>
                        <div className="date">{"12.05.2018"}</div>
                        </div>
                        <div>
                        <small>License Expiry Date</small>
                        <div className="date">{"12.05.2018"}</div>
                        </div>
                    </div>
                </div>

                <div className="footer">
                <button className="edit-btn">✏️</button>
                <button className="view-btn" onClick={onViewLicense}>
                    View License
                </button>
                </div>
            </div>
        </div>
    )
}

export default Card;
// CardContainer.tsx
// import React, { FC, PropsWithChildren } from 'react';
// import './Card.scss';

// export const CardContainer: FC<PropsWithChildren> = ({ children }) => {
//   return <div className="card">{children}</div>;
// };
