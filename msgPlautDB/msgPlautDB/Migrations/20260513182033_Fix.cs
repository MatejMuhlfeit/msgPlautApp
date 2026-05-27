using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace msgPlautDB.Migrations
{
    /// <inheritdoc />
    public partial class Fix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityAssignment_ProjectAssignments_ProjectAssignmentId",
                table: "ActivityAssignment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ActivityAssignment",
                table: "ActivityAssignment");

            migrationBuilder.RenameTable(
                name: "ActivityAssignment",
                newName: "ActivityAssignments");

            migrationBuilder.RenameColumn(
                name: "ProjectAssingment",
                table: "ActivityAssignments",
                newName: "ProjectAssingnmentId");

            migrationBuilder.RenameIndex(
                name: "IX_ActivityAssignment_ProjectAssignmentId",
                table: "ActivityAssignments",
                newName: "IX_ActivityAssignments_ProjectAssignmentId");

            migrationBuilder.AddColumn<Guid>(
                name: "ActivityId",
                table: "ActivityAssignments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_ActivityAssignments",
                table: "ActivityAssignments",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    ActivityId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ActivityName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.ActivityId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAssignments_ActivityId",
                table: "ActivityAssignments",
                column: "ActivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityAssignments_Activities_ActivityId",
                table: "ActivityAssignments",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "ActivityId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityAssignments_ProjectAssignments_ProjectAssignmentId",
                table: "ActivityAssignments",
                column: "ProjectAssignmentId",
                principalTable: "ProjectAssignments",
                principalColumn: "ProjectAssignmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityAssignments_Activities_ActivityId",
                table: "ActivityAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityAssignments_ProjectAssignments_ProjectAssignmentId",
                table: "ActivityAssignments");

            migrationBuilder.DropTable(
                name: "Activities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ActivityAssignments",
                table: "ActivityAssignments");

            migrationBuilder.DropIndex(
                name: "IX_ActivityAssignments_ActivityId",
                table: "ActivityAssignments");

            migrationBuilder.DropColumn(
                name: "ActivityId",
                table: "ActivityAssignments");

            migrationBuilder.RenameTable(
                name: "ActivityAssignments",
                newName: "ActivityAssignment");

            migrationBuilder.RenameColumn(
                name: "ProjectAssingnmentId",
                table: "ActivityAssignment",
                newName: "ProjectAssingment");

            migrationBuilder.RenameIndex(
                name: "IX_ActivityAssignments_ProjectAssignmentId",
                table: "ActivityAssignment",
                newName: "IX_ActivityAssignment_ProjectAssignmentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ActivityAssignment",
                table: "ActivityAssignment",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityAssignment_ProjectAssignments_ProjectAssignmentId",
                table: "ActivityAssignment",
                column: "ProjectAssignmentId",
                principalTable: "ProjectAssignments",
                principalColumn: "ProjectAssignmentId");
        }
    }
}
