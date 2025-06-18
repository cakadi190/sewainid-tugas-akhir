import React, { FC, useState, useEffect } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';
import { Link } from '@inertiajs/react';
import axios from 'axios';

// Styled Components
const NotificationDropdownStyled = styled(NavDropdown)`
  .dropdown-menu {
    width: 400px;
    max-height: 500px;
    overflow-y: auto;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-radius: 12px;

    @media (max-width: 768px) {
      width: 350px;
      max-height: 70vh;
      position: fixed !important;
      top: 60px !important;
      right: 10px !important;
      left: 10px !important;
      width: calc(100vw - 20px) !important;
      transform: none !important;
      margin: 0 !important;
    }

    @media (max-width: 576px) {
      border-radius: 8px;
      max-height: 65vh;
    }
  }

  .nav-link {
    padding: 0;
    position: relative;

    &:after {
      display: none;
    }
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 12px 12px 0 0;

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    border-radius: 8px 8px 0 0;
  }
`;

const NotificationTitle = styled.h6`
  margin: 0;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
`;

const MarkAllReadButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;

  &:hover {
    background-color: rgba(0, 123, 255, 0.1);
    color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.375rem;

    .mobile-text {
      display: none;
    }
  }
`;

const NotificationItem = styled(Link)<{ isRead?: boolean }>`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  display: block;
  transition: background-color 0.2s ease;
  background-color: ${({ isRead }) => isRead ? '#ffffff' : '#f8f9ff'};

  &:hover {
    background-color: #f1f3f4;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const NotificationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

const NotificationText = styled.div`
  color: #6c757d;
  font-size: 0.875rem;
  line-height: 1.4;
  flex: 1;

  /* Truncate text */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  strong {
    color: #495057;
    font-weight: 600;
    display: block;
    margin-bottom: 0.25rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    -webkit-line-clamp: 3;

    strong {
      font-size: 0.85rem;
    }
  }
`;

const NotificationTime = styled.div`
  color: #adb5bd;
  font-size: 0.8rem;
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    align-self: flex-end;
    margin-top: 0.25rem;
  }
`;

const ViewAllButton = styled(Link)`
  display: block;
  text-align: center;
  padding: 1rem;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  background-color: #fff;
  border-radius: 0 0 12px 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;
    color: #0056b3;
    text-decoration: none;
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.875rem;
    border-radius: 0 0 8px 8px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: 2px solid white;
`;

const NotificationIconWrapper = styled.div`
  position: relative;
  padding: 0.5rem;
  color: #6c757d;
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1.25rem;
  color: #6c757d;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    font-size: 0.85rem;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem 1.25rem;
  color: #6c757d;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    font-size: 0.85rem;
  }
`;

// Types
interface NotificationData {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    url: string;
    message: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

interface NotificationResponse {
  current_page: number;
  data: NotificationData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Utility functions
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Baru saja';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit lalu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam lalu`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari lalu`;
  }
};

const getNotificationTitle = (type: string): string => {
  switch (type) {
    case 'App\\Notifications\\InvoiceCreatedToAdmin':
      return 'Pesanan Baru';
    case 'App\\Notifications\\PaymentReceived':
      return 'Pembayaran Diterima';
    case 'App\\Notifications\\SystemMaintenance':
      return 'Pemeliharaan Sistem';
    default:
      return 'Notifikasi';
  }
};

const NotificationDropdown: FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [markingAllRead, setMarkingAllRead] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<NotificationResponse>(
        route('v1.global.notifications.index')
      );

      setNotifications(response.data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingAllRead(true);

      // Assuming you have an endpoint to mark all as read
      await axios.post(route('v1.global.notifications.read-all'));

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          read_at: new Date().toISOString()
        }))
      );
    } catch (err) {
      console.error('Error marking all as read:', err);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleNotificationClick = async (notification: NotificationData) => {
    try {
      // Mark as read if not already read
      if (!notification.read_at) {
        await axios.post(route('v1.global.notifications.mark-read', { id: notification.id }));

        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id
              ? { ...n, read_at: new Date().toISOString() }
              : n
          )
        );
      }

      // Navigate to the notification URL
      if (notification.data.url) {
        window.location.href = notification.data.url;
      }
    } catch (err) {
      console.error('Error handling notification click:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <NotificationDropdownStyled
      title={
        <NotificationIconWrapper>
          <FontAwesomeIcon icon={faBell} />
          {unreadCount > 0 && (
            <NotificationBadge>
              {unreadCount > 9 ? '9+' : unreadCount}
            </NotificationBadge>
          )}
        </NotificationIconWrapper>
      }
      id="notification-dropdown"
      align="end"
    >
      <NotificationHeader>
        <NotificationTitle>Notifikasi</NotificationTitle>
        {unreadCount > 0 && (
          <MarkAllReadButton
            onClick={markAllAsRead}
            disabled={markingAllRead}
          >
            <FontAwesomeIcon
              icon={markingAllRead ? faSpinner : faCheck}
              spin={markingAllRead}
            />
            <span className="mobile-text">Tandai Sudah Dibaca</span>
          </MarkAllReadButton>
        )}
      </NotificationHeader>

      {loading ? (
        <LoadingState>
          <FontAwesomeIcon icon={faSpinner} spin />
          Memuat notifikasi...
        </LoadingState>
      ) : error ? (
        <EmptyState>
          {error}
        </EmptyState>
      ) : notifications.length === 0 ? (
        <EmptyState>
          Tidak ada notifikasi
        </EmptyState>
      ) : (
        <>
          {notifications.map((notification) => (
            <NotificationItem
              href={route('v1.global.notifications.referTo', { id: notification.id, url: notification.data.url })}
              key={notification.id}
              isRead={!!notification.read_at}
              onClick={() => handleNotificationClick(notification)}
            >
              <NotificationContent>
                <NotificationRow>
                  <NotificationText>
                    <strong>{getNotificationTitle(notification.type)}</strong>
                    {notification.data.message}
                  </NotificationText>
                  <NotificationTime>
                    {formatTimeAgo(notification.created_at)}
                  </NotificationTime>
                </NotificationRow>
              </NotificationContent>
            </NotificationItem>
          ))}

          <ViewAllButton href={'/dashboard/notifications'}>
            Lihat Semuanya
          </ViewAllButton>
        </>
      )}
    </NotificationDropdownStyled>
  );
};

export default NotificationDropdown;
