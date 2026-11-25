"use client";

import { Card, Tabs } from 'antd';
import BugTab from './components/BugTab';
import EpicHelper from './components/EpicHelperTab';
import StoryPointsTab from './components/StoryPointsTab';
import StoryTab from './components/StoryTab';
import TemplatesTab from './components/TemplatesTab';


export default function FAQPage() {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Tabs defaultActiveKey="story">
          <Tabs.TabPane tab="Epic" key="epic">
            <EpicHelper />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Story" key="story">
            <StoryTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Bug" key="bug">
            <BugTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Story Points" key="story-points">
            <StoryPointsTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Templates" key="templates">
            <TemplatesTab />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );

}
