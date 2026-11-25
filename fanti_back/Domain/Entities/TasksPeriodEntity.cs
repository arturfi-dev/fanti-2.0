using System;
using Domain.Enum;

namespace Domain.Entities
{

  public class TasksPeriodEntity : BaseEntity
  {
    public TasksPeriodEntity()
    {
    }

    public TasksPeriodEntity(Guid PeriodStaffId, int TaskNumber, int TaskHours, string? MainChallenge, string? LessonLearned, Guid AproverId,
      string? CodeReview, int? TaskRealHours, CodeReview codeReviewStatus)
    {
      this.PeriodStaffId = PeriodStaffId;
      this.TaskNumber = TaskNumber;
      this.TaskHours = TaskHours;
      this.MainChallenge = MainChallenge;
      this.LessonLearned = LessonLearned;
      this.AproverId = AproverId;
      this.CodeReview = CodeReview;
      this.TaskRealHours = TaskRealHours;
      this.codeReviewStatus = codeReviewStatus;
    }

    public Guid PeriodStaffId { get; set; }
    public int TaskNumber { get; set; }
    public int TaskHours { get; set; }
    public virtual PeriodStaffEntity PeriodStaff { get; set; }
    public Guid ProjectId { get; set; }
    public virtual ProjectsEntity Project { get; set; }
    public string? MainChallenge { get; set; }
    public string? LessonLearned { get; set; }
    public string? CodeReview { get; set; }
    public int? TaskRealHours { get; set; }
    public Guid? AproverId { get; set; }
    public virtual StaffEntity? Aprover { get; set; }
    public CodeReview codeReviewStatus { get; set; }


  }
}